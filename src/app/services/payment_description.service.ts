import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { paymentDescriptions } from '../entities/payment.entity';
import { PaymentDescriptionsRepository } from '../repositories/payment.repository';
import { Table } from '../../database/enums/index';
import { LoggerService } from '../../logger/custom.logger';

@Injectable()
export class PaymentDescriptionService extends BaseService<
paymentDescriptions,
PaymentDescriptionsRepository<paymentDescriptions>
> {
    constructor(repository: PaymentDescriptionsRepository<paymentDescriptions>, table: Table) {
        super(repository, table);
        this.table = Table.PAYMENT_DESCRIPTION;
    }

}
