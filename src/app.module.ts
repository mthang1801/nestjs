import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// User modules
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { DatabaseModule } from './database/database.module';
import { appConfig, databaseConfig, authConfig } from './config/index.config';
import { LoggerModule } from './logger/logger.module';
import { UserHttpModule } from './users/user-http-module';
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
  ],
})
export class AppModule {}
