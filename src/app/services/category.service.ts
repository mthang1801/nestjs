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

import { convertToMySQLDateTime } from '../../utils/helper';
import {
  CategoryDto,
  CreateCategoryVendorProductCountDto,
  CategoryDescriptionDto,
} from '../dto/category/create-category.dto';
import { CategoryVendorProductCountEntity } from '../entities/category.entity';
import { CategoryVendorProductCountRepository } from '../repositories/category.repository';
import { SortBy } from '../../database/enums/sortBy.enum';
import { PrimaryKeys } from '../../database/enums/primary-keys.enum';
import { JoinTable } from '../../database/enums/joinTable.enum';
import {
  UpdateCategoryDescriptionDto,
  UpdateCategoryVendorProductCountDto,
} from '../dto/category/update-category.dto';

@Injectable()
export class CategoryService {
  private categoriesTable: Table = Table.CATEGORIES;
  constructor(
    private categoryDescriptionRepo: CategoryDescriptionRepository<CategoryDescriptionEntity>,
    private categoryRepository: CategoryRepository<CategoryEntity>,
    private categoryVendorProductCountRepo: CategoryVendorProductCountRepository<CategoryVendorProductCountEntity>,
  ) {}

  async createCategory(categoryDto: CategoryDto): Promise<CategoryEntity> {
    const newCategory = await this.categoryRepository.create({
      ...categoryDto,
      created_at: convertToMySQLDateTime(),
      updated_at: convertToMySQLDateTime(),
    });
    return newCategory;
  }

  async updateCategory(
    id: number,
    categoryDto: CategoryDto,
  ): Promise<CategoryEntity> {
    await this.categoryRepository.update(id, {
      ...categoryDto,
      updated_at: convertToMySQLDateTime(),
    });
    const updatedCategory = await this.findCategoryById(id);
    return updatedCategory;
  }

  async updateCategoryVendorProductCount(
    id: number,
    updateCategoryVendorProductCount: UpdateCategoryVendorProductCountDto,
  ): Promise<CategoryVendorProductCountEntity> {
    await this.categoryVendorProductCountRepo.update(id, {
      ...updateCategoryVendorProductCount,
      updated_at: convertToMySQLDateTime(),
    });
    const updatedCategoryVendor = this.findCategoryVendorProductCountById(id);
    return updatedCategoryVendor;
  }

  async fetchCategoryList(
    skip: number,
    limit: number,
  ): Promise<CategoryEntity[]> {
    const categoriesList = await this.categoryRepository.find({
      select: [
        '*',
        `${Table.CATEGORIES}.category_id`,
        `${Table.CATEGORIES}.created_at`,
        `${Table.CATEGORIES}.updated_at`,
      ],
      join: {
        [JoinTable.leftJoin]: {
          ddv_category_descriptions: {
            fieldJoin: 'category_id',
            rootJoin: 'category_id',
          },
          ddv_category_vendor_product_count: {
            fieldJoin: 'ddv_category_vendor_product_count.category_id',
            rootJoin: 'category_id',
          },
        },
      },
      orderBy: [
        { field: `${Table.CATEGORIES}.created_at`, sort_by: SortBy.DESC },
      ],
      skip,
      limit,
    });
    return categoriesList;
  }

  async fetchVendorProductCount(
    skip: number,
    limit: number,
  ): Promise<CategoryVendorProductCountEntity[]> {
    const categoriesVendorList = await this.categoryVendorProductCountRepo.find(
      {
        select: [
          '*',
          `${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.product_count`,
          `${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.created_at`,
          `${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.updated_at`,
        ],
        join: {
          [JoinTable.innerJoin]: {
            ddv_categories: {
              fieldJoin: 'category_id',
              rootJoin: 'category_id',
            },
          },
        },
        orderBy: [
          {
            field: `${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.created_at`,
            sort_by: SortBy.DESC,
          },
        ],
        skip,
        limit,
      },
    );
    return categoriesVendorList;
  }

  async createCategoryDescription(
    createCategoryDescriptionDto: CategoryDescriptionDto,
  ): Promise<CategoryDescriptionEntity> {
    const newCategoryDescription = await this.categoryDescriptionRepo.create({
      ...createCategoryDescriptionDto,
      created_at: convertToMySQLDateTime(),
      updated_at: convertToMySQLDateTime(),
    });
    return newCategoryDescription;
  }

  async updateCategoryDescription(
    id: number,
    updateCategoryDescriptionDto: UpdateCategoryDescriptionDto,
  ): Promise<CategoryDescriptionEntity> {
    await this.categoryDescriptionRepo.update(id, updateCategoryDescriptionDto);
    return this.findCategoryDescriptionById(id);
  }

  async createCategoryVendorProductCount(
    createCategoryVendorProductCountDto: CreateCategoryVendorProductCountDto,
  ): Promise<CategoryVendorProductCountEntity> {
    const newCategoryVendor = await this.categoryVendorProductCountRepo.create({
      ...createCategoryVendorProductCountDto,
      created_at: convertToMySQLDateTime(),
      updated_at: convertToMySQLDateTime(),
    });
    return newCategoryVendor;
  }

  async findCategoryById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      select: [
        '*',
        `${Table.CATEGORIES}.created_at`,
        `${Table.CATEGORIES}.updated_at`,
      ],
      join: {
        [JoinTable.innerJoin]: {
          ddv_category_descriptions: {
            fieldJoin: 'category_id',
            rootJoin: 'category_id',
          },
        },
      },
      where: { [`${Table.CATEGORIES}.category_id`]: id },
    });

    return category;
  }

  async findCategoryByCompanyId(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      select: [
        '*',
        `${Table.CATEGORIES}.created_at`,
        `${Table.CATEGORIES}.updated_at`,
      ],
      join: {
        [JoinTable.innerJoin]: {
          ddv_category_descriptions: {
            fieldJoin: 'category_id',
            rootJoin: 'category_id',
          },
        },
      },
      where: { [`${Table.CATEGORIES}.company_id`]: id },
    });
    return category;
  }

  async findCategoryDescriptionById(
    id: number,
  ): Promise<CategoryDescriptionEntity> {
    const categoryDescription = await this.categoryDescriptionRepo.findOne({
      select: [
        '*',
        `${Table.CATEGORY_DESCRIPTIONS}.created_at`,
        `${Table.CATEGORY_DESCRIPTIONS}.updated_at`,
      ],
      join: {
        [JoinTable.innerJoin]: {
          ddv_categories: { fieldJoin: 'category_id', rootJoin: 'category_id' },
        },
      },
      where: { [`${Table.CATEGORY_DESCRIPTIONS}.category_id`]: id },
    });

    return categoryDescription;
  }

  async findCategoryVendorProductCountById(
    id: number,
  ): Promise<CategoryVendorProductCountEntity> {
    const categoryVendor = await this.categoryVendorProductCountRepo.findOne({
      select: [
        '*',
        `${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.product_count`,
        `${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.created_at`,
        `${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.updated_at`,
      ],
      join: {
        [JoinTable.innerJoin]: {
          ddv_categories: { fieldJoin: 'category_id', rootJoin: 'category_id' },
          ddv_category_descriptions: {
            fieldJoin: 'ddv_category_descriptions.category_id',
            rootJoin: 'ddv_categories.category_id',
          },
        },
      },
      where: { [`${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.category_id`]: id },
    });
    return categoryVendor;
  }

  async findCategoryVendorProductCountByCompanyId(
    id: number,
  ): Promise<CategoryVendorProductCountEntity> {
    const categoryVendor = await this.categoryVendorProductCountRepo.findOne({
      select: [
        '*',
        `${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.created_at`,
        `${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.updated_at`,
      ],
      join: {
        [JoinTable.innerJoin]: {
          ddv_categories: { fieldJoin: 'category_id', rootJoin: 'category_id' },
          ddv_category_descriptions: {
            fieldJoin: 'ddv_category_descriptions.category_id',
            rootJoin: 'ddv_categories.category_id',
          },
        },
      },
      where: { [`${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.company_id`]: id },
    });

    return categoryVendor;
  }

  async deleteCategory(id: number): Promise<boolean> {
    await this.categoryRepository.delete(id);
    await this.categoryDescriptionRepo.delete(id);
    await this.categoryVendorProductCountRepo.delete(id);
    return true;
  }

  async deleteCategoryDescription(id: number): Promise<boolean> {
    await this.categoryDescriptionRepo.delete(id);
    return true;
  }

  async deleteCategoryVendorProductCount(id: number): Promise<boolean> {
    await this.categoryVendorProductCountRepo.delete(id);
    return true;
  }
}
