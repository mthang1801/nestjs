import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { UserProfileModule } from './user-profile.module';
import { MailModule } from './mail.module';
import { DatabaseModule } from '../../database/database.module';
import {
  appConfig,
  databaseConfig,
  authConfig,
} from '../../config/index.config';
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
    AuthModule,
    UsersModule,
    MailModule,
    UserProfileModule,
    DatabaseModule,
    LoggerModule,
    StringModule,
    ObjectModule,
  ],
})
export class AppModule {}
