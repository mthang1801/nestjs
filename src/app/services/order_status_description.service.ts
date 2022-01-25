import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { orderStatusDescription } from '../entities/orderStatus.entity';
import { OrderStatusDescriptionRepository } from '../repositories/order_status.repository';
import { Table } from '../../database/enums/index';

@Injectable()
export class OrderStatusDescriptionService extends BaseService<
orderStatusDescription,
OrderStatusDescriptionRepository<orderStatusDescription>
> {
  constructor(repository: OrderStatusDescriptionRepository<orderStatusDescription>, table: Table) {
    super(repository, table);
    this.table = Table.ORDER_STATUS_DESCRIPTION;
  }

}