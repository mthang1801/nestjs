import { BaseRepositorty } from '../../base/base.repository';
import { DatabaseService } from '../../database/database.service';
import { Table } from '../../database/enums/index';
export class PaymentRepository<Payment> extends BaseRepositorty<Payment> {
    constructor(databaseService: DatabaseService, table: Table) {
        super(databaseService, table);
        this.table = Table.PAYMENT;
    }
}
export class PaymentDescriptionsRepository<paymentDescriptions> extends BaseRepositorty<paymentDescriptions> {
    constructor(databaseService: DatabaseService, table: Table) {
        super(databaseService, table);
        this.table = Table.PAYMENT_DESCRIPTION;
    }
}
