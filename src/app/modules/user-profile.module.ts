import { Module } from '@nestjs/common';
import { UserProfileRepository } from '../repositories/user-profile.repository';
import { UserProfileService } from '../services/user-profile.service';
@Module({
  providers: [UserProfileRepository, UserProfileService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
