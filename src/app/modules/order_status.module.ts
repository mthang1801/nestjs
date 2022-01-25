import { Module } from '@nestjs/common';
import { OrderStatusController } from '../controllers/be/order_status.controller';
import { OrderStatusService } from '../services/order_status.service';
import { OrderStatusDescriptionService } from '../services/order_status_description.service';
import { OrderStatusDataService } from '../services/order_status_data.service';
import { OrderStatusDataRepository,OrderStatusRepository,OrderStatusDescriptionRepository } from '../repositories/order_status.repository';
@Module({
  controllers: [OrderStatusController],
  providers: [OrderStatusService,OrderStatusRepository,OrderStatusDataService,OrderStatusDataRepository,OrderStatusDescriptionService,OrderStatusDescriptionRepository,String],
  exports: [OrderStatusService,OrderStatusDescriptionService,OrderStatusDataService],
  imports :[],

})
export class OrderStatusModule {}