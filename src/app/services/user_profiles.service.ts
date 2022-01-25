import { Injectable } from '@nestjs/common';
import { Table } from '../../database/enums/tables.enum';
import { UserProfileEntity } from '../entities/user.entity';
import { UserProfileRepository } from '../repositories/user.repository';
import { BaseService } from '../../base/base.service';
import { UserEntity } from '../entities/user.entity';
@Injectable()
export class UserProfilesService {
  private table: Table = Table.USER_PROFILES;
  constructor(private repository: UserProfileRepository<UserProfileEntity>) {}

  async createUserProfile(user: UserEntity): Promise<UserProfileEntity> {
    const userProfile = {
      user_id: user.user_id,
      b_firstname: user.firstname,
      b_lastname: user.lastname,
      b_phone: user.phone,
    };
    const newUserProfile = await this.repository.create(userProfile);

    return newUserProfile;
  }
}
