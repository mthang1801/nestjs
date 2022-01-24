import { Injectable } from '@nestjs/common';
import {
  CategoryEntity,
  CategoryDescriptionEntity,
} from '../entities/category.entity';
import { BaseRepositorty } from '../../base/base.repository';
import { DatabaseService } from '../../database/database.service';
import { Table } from '../../database/enums/tables.enum';
import { CategoryVendorProductCount } from '../entities/category.entity';

@Injectable()
export class CategoryRepository<
  CategoryEntity,
> extends BaseRepositorty<CategoryEntity> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.CATEGORIES;
  }
}

@Injectable()
export class CategoryDescriptionRepository<
  CategoryDescriptionEntity,
> extends BaseRepositorty<CategoryDescriptionEntity> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.CATEGORY_DESCRIPTIONS;
  }
}

@Injectable()
export class CategoryVendorProductCountRepository<
  CategoryVendorProductCount,
> extends BaseRepositorty<CategoryVendorProductCount> {
  constructor(databaseService: DatabaseService, table: Table) {
    super(databaseService, table);
    this.table = Table.CATEGORY_VENDOR_PRODUCT_COUNT;
  }
}
