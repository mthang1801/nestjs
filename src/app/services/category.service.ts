import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';
import { Table } from '../../database/enums/tables.enum';

@Injectable()
export class CategoryService extends BaseService<
  CategoryEntity,
  CategoryRepository<CategoryEntity>
> {
  constructor(repository: CategoryRepository<CategoryEntity>, table: Table) {
    super(repository, table);
    this.table = Table.CATEGORIES;
  }
}
