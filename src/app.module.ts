import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// User modules
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    OrdersModule
  ]
})
export class AppModule {}
