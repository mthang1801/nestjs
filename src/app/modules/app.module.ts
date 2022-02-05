import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { MailModule } from './mail.module';
import { BannerModule } from './banner.module';
import { OrderStatusModule } from './order_status.module';
import { PaymentModule } from './payment.module';
import { DatabaseModule } from '../../database/database.module';
import {
  appConfig,
  databaseConfig,
  authConfig,
  cacheConfig,
} from '../../config/index.config';
import { LoggerModule } from '../../logger/logger.module';
import { StringModule } from './string.module';
import { ObjectModule } from './object.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from '../helpers/exeptions/allExeptionsFilter';
import { UserGroupsModule } from './user_groups.module';
import { CategoryModule } from './category.module';
import { ImageModule } from './image.module';
import { HttpExceptionFilterTest } from '../../middlewares/http-exeption.filter';

import { ConfigService } from '@nestjs/config';
import { RedisModule } from './redisCache.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './tasks.module';
import { QueueModule } from './queue.module';
import { OptimizeModule } from './optimize.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import multer from 'multer';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, authConfig, cacheConfig],
    }),
    EventEmitterModule.forRoot({
      maxListeners: 100,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './uploads',
      }),
    }),
    ScheduleModule.forRoot(),
    TaskModule,
    RedisModule,
    QueueModule,
    OptimizeModule,
    AuthModule,
    UsersModule,
    MailModule,
    DatabaseModule,
    LoggerModule,
    BannerModule,
    StringModule,
    ObjectModule,
    UserGroupsModule,
    CategoryModule,
    OrderStatusModule,
    PaymentModule,
    ImageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilterTest,
    },
  ],
})
export class AppModule {}
