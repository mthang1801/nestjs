import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { BaseRepositorty } from '../../../base/base.repository';

import { Table } from '../../../database/enums/index';
import { AccessProvider } from './access-provider.entity';
@Injectable()
export class AccessProviderRepository<
  AccessProvider,
> extends BaseRepositorty<AccessProvider> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.GOOGLE_ACCESS;
  }
}
