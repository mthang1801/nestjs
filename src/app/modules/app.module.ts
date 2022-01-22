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
import { UsersProfilesModule } from './user-profiles.module';
import { LoggerModule } from '../../logger/logger.module';
import { StringModule } from './string.module';
import { ObjectModule } from './object.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, authConfig],
    }),
    UsersProfilesModule,
    AuthModule,
    UsersModule,
    MailModule,
    DatabaseModule,
    LoggerModule,
    BannerModule,
    StringModule,
    ObjectModule,
  ],
})
export class AppModule {}
