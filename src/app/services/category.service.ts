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
  CreateCategoryDto,
  CreateCategoryVendorProductCountDto,
  CategoryDescriptionDto,
} from '../dto/category/create-category.dto';
import { CategoryVendorProductCountEntity } from '../entities/category.entity';
import { CategoryVendorProductCountRepository } from '../repositories/category.repository';
import { SortBy } from '../../database/enums/sortBy.enum';
import { PrimaryKeys } from '../../database/enums/primary-keys.enum';
import { JoinTable } from '../../database/enums/joinTable.enum';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
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

  async createCategory(
    categoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const newCategory = await this.categoryRepository.create({
      ...categoryDto,
      created_at: convertToMySQLDateTime(),
      updated_at: convertToMySQLDateTime(),
    });
    return newCategory;
  }

  async updateCategory(
    categoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const checkCategoryExist = await this.findCategoryById(
      categoryDto.category_id,
    );
    if (!checkCategoryExist) {
      throw new HttpException('Không tìm thấy category.', HttpStatus.NOT_FOUND);
    }
    await this.categoryRepository.update(categoryDto.category_id, {
      ...categoryDto,
      updated_at: convertToMySQLDateTime(),
    });
    const updatedCategory = await this.findCategoryById(
      categoryDto.category_id,
    );
    return updatedCategory;
  }

  async updateCategoryVendorProductCount(
    data: UpdateCategoryVendorProductCountDto,
  ): Promise<CategoryVendorProductCountEntity> {
    const checkCategoryVPC = await this.categoryVendorProductCountRepo.findOne({
      where: { category_id: data.category_id, company_id: data.company_id },
    });
    if (!checkCategoryVPC) {
      throw new HttpException('Không tìm thấy thông tin', HttpStatus.NOT_FOUND);
    }

    await this.categoryVendorProductCountRepo.update(
      { category_id: data.category_id, company_id: data.company_id },
      {
        ...data,
        updated_at: convertToMySQLDateTime(),
      },
    );
    // const updatedCategoryVendor =
    //   this.findCategoryVendorProductCountByCategoryId(id);
    return this.categoryVendorProductCountRepo.findOne({
      where: { category_id: data.category_id, company_id: data.company_id },
    });
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

  async fetchCategoryDescriptionList(
    skip: number,
    limit: number,
  ): Promise<CategoryDescriptionEntity[]> {
    const categoriesDescription = await this.categoryDescriptionRepo.find({
      select: [
        '*',
        `${Table.CATEGORY_DESCRIPTIONS}.created_at`,
        `${Table.CATEGORY_DESCRIPTIONS}.updated_at`,
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
          field: `${Table.CATEGORY_DESCRIPTIONS}.updated_at`,
          sort_by: SortBy.DESC,
        },
      ],
      skip,
      limit,
    });
    return categoriesDescription;
  }

  async updateCategoryDescription(
    company_id: number,
    updateCategoryDescriptionDto: UpdateCategoryDescriptionDto,
  ): Promise<CategoryDescriptionEntity> {
    await this.categoryDescriptionRepo.update(
      company_id,
      updateCategoryDescriptionDto,
    );
    const updatedCategoryDescription =
      await this.findCategoryDescriptionByCategoryId(company_id);

    return updatedCategoryDescription;
  }

  async createCategoryVendorProductCount(
    data: CreateCategoryVendorProductCountDto,
  ): Promise<CategoryVendorProductCountEntity> {
    const newCategoryVendor = await this.categoryVendorProductCountRepo.create({
      ...data,
      created_at: convertToMySQLDateTime(),
      updated_at: convertToMySQLDateTime(),
    });

    return newCategoryVendor;
  }

  async findCategoryById(category_id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      select: ['*', `${Table.CATEGORIES}.*`],
      join: {
        [JoinTable.innerJoin]: {
          ddv_category_descriptions: {
            fieldJoin: 'category_id',
            rootJoin: 'category_id',
          },
        },
      },
      where: { [`${Table.CATEGORIES}.category_id`]: category_id },
    });

    return category;
  }

  async findCategoryByCompanyId(company_id: number): Promise<CategoryEntity[]> {
    const category = await this.categoryRepository.find({
      select: ['*', `${Table.CATEGORIES}.*`],
      join: {
        [JoinTable.leftJoin]: {
          ddv_category_descriptions: {
            fieldJoin: 'category_id',
            rootJoin: 'category_id',
          },
        },
      },
      where: { [`${Table.CATEGORIES}.company_id`]: company_id },
    });
    return category;
  }

  async findCategoryDescriptionByCategoryId(
    category_id: number,
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
      where: { [`${Table.CATEGORY_DESCRIPTIONS}.category_id`]: category_id },
    });

    return categoryDescription;
  }

  async findCategoryVendorProductCountByCategoryId(
    category_id: number,
  ): Promise<CategoryVendorProductCountEntity[]> {
    const categoryVendor = await this.categoryVendorProductCountRepo.find({
      select: ['*', `${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.*`],
      join: {
        [JoinTable.innerJoin]: {
          ddv_categories: { fieldJoin: 'category_id', rootJoin: 'category_id' },
          ddv_category_descriptions: {
            fieldJoin: 'ddv_category_descriptions.category_id',
            rootJoin: 'ddv_categories.category_id',
          },
        },
      },
      where: {
        [`${Table.CATEGORY_VENDOR_PRODUCT_COUNT}.category_id`]: category_id,
      },
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

  async deleteCategory(category_id: number): Promise<boolean> {
    let res = true;
    res = (await this.categoryRepository.delete(category_id)) && res;
    res = (await this.categoryDescriptionRepo.delete(category_id)) && res;
    res =
      (await this.categoryVendorProductCountRepo.delete({ category_id })) &&
      res;
    return true;
  }

  async deleteCategoryDescription(category_id: number): Promise<boolean> {
    return await this.categoryDescriptionRepo.delete(category_id);
  }

  async deleteCategoryVendorProductCount(
    category_id: number,
    company_id: number,
  ): Promise<boolean> {
    return await this.categoryVendorProductCountRepo.delete({
      category_id,
      company_id,
    });
  }
}
