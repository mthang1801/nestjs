import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserProfilesService } from '../services/user-profiles.service';
import { UserProfileRepository } from '../repositories/user-profiles.repository';
@Module({
  exports: [UserProfilesService],
  providers: [UserProfileRepository, UserProfilesService],
  controllers: [],
})
export class UsersProfilesModule {}
