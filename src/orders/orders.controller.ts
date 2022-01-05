import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersInterface } from './interfaces/orders.interface';

@Controller('orders')
export class OrdersController {

    constructor(
        private ordersService: OrdersService) 
    {
        //
    }

    @Get()
    async findAll(): Promise<OrdersInterface[]> {
        return this.ordersService.findAll();
    }
}