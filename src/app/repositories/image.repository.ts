import { BaseRepositorty } from '../../base/base.repository';
import { DatabaseService } from '../../database/database.service';
import { Table } from '../../database/enums/index';
export class ImagesRepository<
  ImagesEntity,
> extends BaseRepositorty<ImagesEntity> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.IMAGE;
  }
}
export class ImagesLinksRepository<
  ImagesLinksEntity,
> extends BaseRepositorty<ImagesLinksEntity> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.IMAGE_LINK;
  }
}
