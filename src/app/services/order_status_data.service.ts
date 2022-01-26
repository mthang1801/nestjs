import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { orderStatusData } from '../entities/orderStatus.entity';
import { OrderStatusDataRepository } from '../repositories/order_status.repository';
import { Table } from '../../database/enums/index';

@Injectable()
export class OrderStatusDataService extends BaseService<
orderStatusData,
  OrderStatusDataRepository<orderStatusData>
> {
  constructor(repository: OrderStatusDataRepository<orderStatusData>, table: Table) {
    super(repository, table);
    this.table = Table.ORDER_STATUS_DATA;
  }

}
