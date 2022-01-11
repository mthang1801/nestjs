import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/custom.logger';
import { MailModule } from '../mail/mail.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    UsersModule,
    ConfigService,
    LoggerService,
    MailModule,
    DatabaseModule,
  ],
  providers: [UsersService, LoggerService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UserHttpModule {}
