import { Injectable } from '@nestjs/common';
import {
  UserGroupEntity,
  UserGroupPrivilegeEntity,
} from '../entities/user_groups';
import { BaseRepositorty } from '../../base/base.repository';
import { DatabaseService } from '../../database/database.service';
import { Table } from '../../database/enums/tables.enum';
import {
  UserGroupLinkEntity,
  UserGroupDescriptionEntity,
} from '../entities/user_groups';
@Injectable()
export class UserGroupsRepository<
  UserGroupEntity,
> extends BaseRepositorty<UserGroupEntity> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.USER_GROUPS;
  }
}
@Injectable()
export class UserGroupPrivilegesRepository<
  UserGroupPrivilegeEntity,
> extends BaseRepositorty<UserGroupPrivilegeEntity> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.USER_GROUP_PRIVILEGES;
  }
}
@Injectable()
export class UserGroupLinksRepository<
  UserGroupLinkEntity,
> extends BaseRepositorty<UserGroupLinkEntity> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.USER_GROUP_LINKS;
  }
}
@Injectable()
export class UserGroupDescriptionsRepository<
  UserGroupDescriptionEntity,
> extends BaseRepositorty<UserGroupDescriptionEntity> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.USER_GROUP_DESCRIPTIONS;
  }
}
