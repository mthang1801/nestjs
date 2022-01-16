import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { BaseRepositorty } from '../../../base/base.repository';
@Injectable()
export class UserRepository<User> extends BaseRepositorty<User> {
  constructor(databaseService: DatabaseService) {
    super(databaseService);
  }
}
