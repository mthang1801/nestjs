import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { UserGroupsRepository } from '../repositories/user_groups.repository';
import { UserGroupEntity } from '../entities/user_groups';
import { Table } from '../../database/enums/tables.enum';

@Injectable()
export class UserGroupsService extends BaseService<
  UserGroupEntity,
  UserGroupsRepository<UserGroupEntity>
> {
  constructor(repository: UserGroupsRepository<UserGroupEntity>, table: Table) {
    super(repository, table);
    this.table = Table.USER_GROUPS;
  }
}
