import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { BaseRepositorty } from '../../base/base.repository';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { Table } from '../../database/enums/tables.enum';
@Injectable()
export class UserProfileRepository<
  UserProfileEntity,
> extends BaseRepositorty<UserProfileEntity> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.USER_PROFILES;
  }
}
