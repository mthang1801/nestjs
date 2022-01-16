import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { BaseRepositorty } from '../../../base/base.repository';

import { Table } from '../../../database/enums/index';
@Injectable()
export class UserRepository<User> extends BaseRepositorty<User> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.USERS;
  }
}
