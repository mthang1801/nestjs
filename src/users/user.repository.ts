import {
  ConsoleLogger,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DatabaseCollection } from '../collections/database.collection';
import { Operator } from '../database/enums/operator.enum';
import { BaseRepositorty } from '../base/base.repository';
import { User } from './user.entity';
import { Table } from '../database/enums/tables.enum';
@Injectable()
export class UserRepository<User> extends BaseRepositorty<User> {
  constructor(databaseService: DatabaseService) {
    super(databaseService);
  }
}
