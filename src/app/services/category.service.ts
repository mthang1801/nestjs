import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import {
  CategoryDescriptionEntity,
  CategoryEntity,
} from '../entities/category.entity';
import {
  CategoryRepository,
  CategoryDescriptionRepository,
} from '../repositories/category.repository';
import { Table } from '../../database/enums/tables.enum';
import {
  CreateCategoryDto,
  CreateCategoryDescriptionDto,
} from '../dto/category/create-category.dto';
import { convertToMySQLDateTime } from '../../utils/helper';
import { CreateCategoryVendorProductCountDto } from '../dto/category/create-category.dto';
import { CategoryVendorProductCountEntity } from '../entities/category.entity';
import { CategoryVendorProductCountRepository } from '../repositories/category.repository';
import { SortBy } from '../../database/enums/sortBy.enum';
import { PrimaryKeys } from '../../database/enums/primary-keys.enum';

@Injectable()
export class CategoryService extends BaseService<
  CategoryEntity,
  CategoryRepository<CategoryEntity>
> {
  protected categoryRepository: CategoryRepository<CategoryEntity>;
  constructor(
    repository: CategoryRepository<CategoryEntity>,
    table: Table,
    private categoryDescriptionRepo: CategoryDescriptionRepository<CategoryDescriptionEntity>,
    private categoryVendorProductCount: CategoryVendorProductCountRepository<CategoryVendorProductCountEntity>,
  ) {
    super(repository, table);
    this.table = Table.CATEGORIES;
    this.categoryRepository = repository;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const newCategory = await this.categoryRepository.create({
      ...createCategoryDto,
      created_at: convertToMySQLDateTime(),
      updated_at: convertToMySQLDateTime(),
    });
    return newCategory;
  }

  async getCategoryList(
    skip: number,
    limit: number,
  ): Promise<CategoryEntity[]> {
    const categoriesList = await this.categoryRepository.find({
      orderBy: [
        { field: `${Table.CATEGORIES}.created_at`, sort_by: SortBy.DESC },
      ],
      skip,
      limit,
    });
    return categoriesList;
  }

  async createCategoryDescription(
    createCategoryDescriptionDto: CreateCategoryDescriptionDto,
  ): Promise<CategoryDescriptionEntity> {
    const newCategoryDescription = await this.categoryDescriptionRepo.create({
      ...createCategoryDescriptionDto,
      created_at: convertToMySQLDateTime(),
      updated_at: convertToMySQLDateTime(),
    });
    return newCategoryDescription;
  }

  async createCategoryVendorProductCount(
    createCategoryVendorProductCountDto: CreateCategoryVendorProductCountDto,
  ): Promise<CategoryVendorProductCountEntity> {
    const newCategoryVendor = await this.categoryVendorProductCount.create({
      ...createCategoryVendorProductCountDto,
      created_at: convertToMySQLDateTime(),
      updated_at: convertToMySQLDateTime(),
    });
    return newCategoryVendor;
  }

  async findCategoryById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id);

    return category;
  }

  async findCategoryDescriptionById(
    id: number,
  ): Promise<CategoryDescriptionEntity> {
    const categoryDescription = await this.categoryDescriptionRepo.findById(id);
    return categoryDescription;
  }

  async findCategoryVendorProductCountById(
    id: number,
  ): Promise<CategoryVendorProductCountEntity> {
    const categoryVendor = await this.categoryVendorProductCount.findById(id);
    return categoryVendor;
  }

  async findCategoryVendorProductCountByCompanyId(
    id: number,
  ): Promise<CategoryVendorProductCountEntity> {
    const categoryVendor = await this.categoryVendorProductCount.findById({
      [PrimaryKeys[this.table]]: id,
    });

    return categoryVendor;
  }
}
