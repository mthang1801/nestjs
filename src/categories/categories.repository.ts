import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { BaseRepositorty } from '../base/base.repository';
import { Category } from './categories.entity';
@Injectable()
export class CategoriesRepository<Category> extends BaseRepositorty<Category> {
  constructor(databaseService: DatabaseService) {
    super(databaseService);
  }
}
