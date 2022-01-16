import { Injectable } from '@nestjs/common';
import { OrdersInterface } from './interfaces/orders.interface';

@Injectable()
export class OrdersService {

    private readonly orders: OrdersInterface[] = [];

    create(order: OrdersInterface) {
        this.orders.push(order);
    }

    findAll(): OrdersInterface[] {
        return this.orders;
    }
}