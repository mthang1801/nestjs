import { BaseRepositorty } from '../../base/base.repository';
import { DatabaseService } from '../../database/database.service';
import { Table } from '../../database/enums/index';
export class ImagesRepository<Images> extends BaseRepositorty<Images> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.IMAGE;
  }
}
export class ImagesLinksRepository<ImagesLinks> extends BaseRepositorty<ImagesLinks> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.IMAGE_LINK;
  }
}