import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// User modules
import { OrdersModule } from './app/backend/orders/orders.module';
import { AuthModule } from './app/backend/auth/auth.module';
import { UsersModule } from './app/backend/users/users.module';
import { MailModule } from './app/backend/mail/mail.module';
import { DatabaseModule } from './database/database.module';
import { appConfig, databaseConfig, authConfig } from './config/index.config';
import { LoggerModule } from './logger/logger.module';
import { ProductsModule } from './app/products/products.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, authConfig],
    }),
    OrdersModule,
    AuthModule,
    UsersModule,
    MailModule,
    DatabaseModule,
    LoggerModule,
    ProductsModule,
  ],
})
export class AppModule {}
