import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { DatabaseModule } from '../database/database.module';
import { LoggerService } from '../logger/custom.logger';
import * as bcrypt from 'bcrypt';
import { ConfigService, ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    LoggerService,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecretKey'),
        signOptions: { expiresIn: configService.get<string>('jwtExpiresIn') },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    MailModule,
  ],
  exports: [UsersService],
  providers: [UsersService, JwtStrategy, LoggerService],
  controllers: [UsersController],
})
export class UsersModule {}
