import { BaseRepositorty } from '../../base/base.repository';
import { DatabaseService } from '../../database/database.service';
import { Table } from '../../database/enums/index';
export class AuthProviderRepository<
  AuthProvider,
> extends BaseRepositorty<AuthProvider> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.USERS_AUTH;
  }
}
