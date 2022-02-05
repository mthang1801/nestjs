import {
  MiddlewareConsumer,
  Module,
  NestModule,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersController as UsersControllerBe } from '../controllers/be/users.controller';
import { UsersController as UsersControllerFe } from '../controllers/fe/users.controller';
import { MailModule } from './mail.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import {
  UserRepository,
  UserProfileRepository,
} from '../repositories/user.repository';
import { UserProfilesService } from '../services/user_profiles.service';
import { HttpExceptionFilterTest } from '../../middlewares/http-exeption.filter';
import { UsersController as UsersControllerV2 } from '../controllers/fe/users.v2.controller';
@Module({
  imports: [MailModule],
  exports: [UsersService],
  providers: [
    UsersService,
    UserProfilesService,
    UserRepository,
    UserProfileRepository,
  ],
  controllers: [UsersControllerBe, UsersControllerFe, UsersControllerV2],
})
// @UseFilters(HttpExceptionFilterTest)
export class UsersModule {}
