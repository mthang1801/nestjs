import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { CategoriesRepository } from './categories.repository';
import { LoggerService } from '../logger/custom.logger';
import { Category } from './categories.entity';
import { Table } from '../database/enums/tables.enum';
import { Observable } from 'rxjs';
@Injectable()
export class CategoriesService extends BaseService<
  Category,
  CategoriesRepository<Category>
> {
  constructor(
    repository: CategoriesRepository<Category>,
    logger: LoggerService,
  ) {
    super(repository, logger);
    this.table = Table.CATEGORIES;
  }
  async createCategory(categoryName: string): Promise<Category> {
    return this.repository.insert({ categoryName }, this.table);
  }

  async getCategoryByID(id: number): Promise<Category | any> {
    return this.repository.findById(id, this.table);
  }

  async updateCategoryName(
    id: number,
    categoryName: string,
  ): Promise<Category | any> {
    const res = await this.repository.update([{ id }], this.table, [
      { categoryName },
    ]);
    return res;
  }
}
