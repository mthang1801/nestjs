import { BaseRepositorty } from '../../base/base.repository';
import { DatabaseService } from '../../database/database.service';
import { Table } from '../../database/enums/index';
export class OrderStatusRepository<orderStatus> extends BaseRepositorty<orderStatus> {
    constructor(databaseService: DatabaseService, table: Table) {
        super(databaseService, table);
        this.table = Table.ORDER_STATUS;
    }
}
export class OrderStatusDataRepository<orderStatusData> extends BaseRepositorty<orderStatusData> {
    constructor(databaseService: DatabaseService, table: Table) {
        super(databaseService, table);
        this.table = Table.ORDER_STATUS_DATA;
    }
}
export class OrderStatusDescriptionRepository<orderStatusDescription> extends BaseRepositorty<orderStatusDescription> {
    constructor(databaseService: DatabaseService, table: Table) {
        super(databaseService, table);
        this.table = Table.ORDER_STATUS_DESCRIPTION;
    }
}