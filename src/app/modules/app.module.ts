import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { MailModule } from './mail.module';
import { BannerModule } from './banner.module';
import { DatabaseModule } from '../../database/database.module';
import {
  appConfig,
  databaseConfig,
  authConfig,
} from '../../config/index.config';
import { LoggerModule } from '../../logger/logger.module';
import { StringModule } from './string.module';
import { ObjectModule } from './object.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../helpers/exeptions/allExeptionsFilter';
import { UserGroupsModule } from './user_groups.module';
import {CategoryModule} from "./category.module"
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, authConfig],
    }),
    AuthModule,
    UsersModule,
    MailModule,
    DatabaseModule,
    LoggerModule,
    BannerModule,
    StringModule,
    ObjectModule,
    UserGroupsModule,
    CategoryModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
