import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { UserProfileRepository } from '../repositories/user-profile.repository';
import { BaseRepositorty } from '../../base/base.repository';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { LoggerService } from '../../logger/custom.logger';
import { Table } from '../../database/enums/tables.enum';
import { UserEntity } from '../entities/user.entity';
export class UserProfileService extends BaseService<
  UserProfileEntity,
  UserProfileRepository<UserProfileEntity>
> {
  private userProfileRepo: UserProfileRepository<UserProfileEntity>;
  constructor(
    repository: UserProfileRepository<UserProfileEntity>,
    logger: LoggerService,
    table: Table,
  ) {
    super(repository, logger, table);
    this.table = Table.USER_PROFILES;
    this.userProfileRepo = repository;
  }

  async createUserProfile(user: UserEntity): Promise<UserProfileEntity> {
    const userProfile = {
      user_id: user.user_id,
      b_firstname: user.firstname,
      b_lastname: user.lastname,
      b_phone: user.phone || '',
    };

    const newUserProfile = await this.userProfileRepo.create(userProfile);
    console.log(newUserProfile);
    return newUserProfile;
  }
}
