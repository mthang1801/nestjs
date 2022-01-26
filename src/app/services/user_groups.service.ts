import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import {
  UserGroupsRepository,
  UserGroupDescriptionsRepository,
  UserGroupLinksRepository,
  UserGroupPrivilegesRepository,
} from '../repositories/user_groups.repository';

import { Table } from '../../database/enums/tables.enum';
import { CreateUserGroupsDto } from '../dto/usergroups/create-usergroups.dto';
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
  UserGroupIdEnum,
  UserStatusEnum,
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

  async createUserGroups(
    createUserGroupsDto: CreateUserGroupsDto,
  ): Promise<any> {
    const newUserItem = {
      ...createUserGroupsDto,
      birthday: formatDate(createUserGroupsDto.birthday),
      user_login: AuthProviderEnum.SYSTEM,
      created_at: convertToMySQLDateTime(),
    };
    const newUser = await this.userRepo.create(newUserItem);
    const userGroupLinkItem = {
      user_id: newUser.user_id,
      usergroup_id: UserGroupIdEnum.Wholesale,
      status: UserStatusEnum.Active,
    };
    const userGroupLink = await this.userGroupLinksRepo.create(
      userGroupLinkItem,
    );
    return { userData: newUser, userGroupLink: userGroupLink };
  }
}
