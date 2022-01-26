import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import {
  UserGroupsRepository,
  UserGroupDescriptionsRepository,
  UserGroupLinksRepository,
  UserGroupPrivilegesRepository,
} from '../repositories/user_groups.repository';

import { Table } from '../../database/enums/tables.enum';
import {
  CreateUserGroupsDto,
  CreateUserGroupDescriptionDto,
} from '../dto/usergroups/create-usergroups.dto';
import { UserRepository } from '../repositories/user.repository';
import {
  UserGroupDescriptionEntity,
  UserGroupEntity,
  UserGroupLinkEntity,
  UserGroupPrivilegeEntity,
} from '../entities/user_groups';
import { UserEntity } from '../entities/user.entity';
import { AuthProviderEnum } from '../helpers/enums/auth_provider.enum';
import { convertToMySQLDateTime, formatDate } from '../../utils/helper';
import { IUserGroupLink } from '../interfaces/user_groups.interface';
import {
  StatusEnum,
  UserGroupTypeEnum,
} from '../helpers/enums/user_groups.enum';

@Injectable()
export class UserGroupsService {
  private userGroupTable: Table = Table.USER_GROUPS;
  private userGroupPrivilegeTable: Table = Table.USER_GROUP_PRIVILEGES;
  private userGroupDescriptionsTable: Table = Table.USER_GROUP_DESCRIPTIONS;
  private userGroupLinksTable: Table = Table.USER_GROUP_LINKS;
  private userTable: Table = Table.USERS;
  constructor(
    private userGroupRepo: UserGroupsRepository<UserGroupEntity>,
    private userGroupPrivilegeRepo: UserGroupPrivilegesRepository<UserGroupPrivilegeEntity>,
    private userGroupDescriptionRepo: UserGroupDescriptionsRepository<UserGroupDescriptionEntity>,
    private userGroupLinksRepo: UserGroupLinksRepository<UserGroupLinkEntity>,
    private userRepo: UserRepository<UserEntity>,
  ) {}

  async createUserGroup(
    createUserGroupsDto: CreateUserGroupsDto,
  ): Promise<any> {
    if (
      !createUserGroupsDto.status &&
      !createUserGroupsDto.company_id &&
      !createUserGroupsDto.type
    ) {
      throw new HttpException(
        'Tạo mới không thành công do tất cả các trường đều bỏ trống',
        HttpStatus.BAD_REQUEST,
      );
    }
    const checkUserGroupExist = await this.userGroupRepo.findOne({
      where: {
        type: createUserGroupsDto?.type,
        company_id: createUserGroupsDto?.company_id,
      },
    });
    if (checkUserGroupExist) {
      throw new HttpException(
        'UserGroup đã tồn tại.',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    const newUserGroup = await this.userGroupRepo.create({
      status: createUserGroupsDto.status || StatusEnum.Active,
      type: createUserGroupsDto?.type || UserGroupTypeEnum.Wholesale,
      company_id: createUserGroupsDto?.company_id || 0,
    });

    if (createUserGroupsDto.description && createUserGroupsDto.lang_code) {
      const newUserGroupDescription =
        await this.userGroupDescriptionRepo.create({
          usergroup_id: newUserGroup.usergroup_id,
          lang_code: createUserGroupsDto.lang_code,
          usergroup: createUserGroupsDto.description,
        });
      return { userGroup: newUserGroup, description: newUserGroupDescription };
    }
    return { userGroup: newUserGroup };
  }

  async createUserGroupDescription(
    data: CreateUserGroupDescriptionDto,
  ): Promise<any> {
    const checkUserGroupDescribeExist =
      await this.userGroupDescriptionRepo.findOne({
        where: {
          usergroup_id: data.usergroup_id,
          lang_code: data.lang_code,
          usergroup: data.usergroup,
        },
      });

    if (checkUserGroupDescribeExist) {
      throw new HttpException(
        'User Group Description đã tồn tại.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userGroupDescriptionRepo.create({
      usergroup_id: data.usergroup_id,
      lang_code: data.lang_code,
      usergroup: data.usergroup,
    });

    const newUserGroupDescription =
      await this.userGroupDescriptionRepo.findById(data.usergroup_id);
    return { description: newUserGroupDescription };
  }
}
