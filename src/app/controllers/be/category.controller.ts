import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { BaseController } from '../../../base/base.controllers';
import { CategoryService } from '../../services/category.service';
import { AuthGuard } from '../../../middlewares/be.auth';
import {
  CategoryDto,
  CategoryDescriptionDto,
  CreateCategoryVendorProductCountDto,
} from '../../dto/category/create-category.dto';
import { IResponse } from '../../interfaces/response.interface';
import { Response } from 'express';
import {
  UpdateCategoryDescriptionDto,
  UpdateCategoryVendorProductCountDto,
} from '../../dto/category/update-category.dto';

/**
 * Controller for Category
 * @Author MvThang
 */
@Controller('/be/v1/category')
export class CategoryController extends BaseController {
  constructor(private categoryService: CategoryService) {
    super();
  }

  /**
   * Create new record in ddv_categories table
   * @param categoryDto
   * @param res
   * @returns
   */
  @Post()
  @UseGuards(AuthGuard)
  async createCategory(
    @Body() categoryDto: CategoryDto,
    @Res() res: Response,
  ): Promise<IResponse> {
    const createdCategory = await this.categoryService.createCategory(
      categoryDto,
    );
    return this.respondCreated(res, createdCategory);
  }

  /**
   * Fetch list categories in ddv_categories table
   * @param skip number
   * @param limit number
   * @param res categories[]
   * @returns
   */
  @Get()
  async getCategoryList(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 10,
    @Res() res: Response,
  ): Promise<IResponse> {
    const categories = await this.categoryService.fetchCategoryList(
      +skip,
      +limit,
    );
    return this.responseSuccess(res, categories);
  }

  /**
   * Update records by category_id in ddv_categories table
   * @param categoryDto
   * @param id
   * @param res
   * @returns
   */
  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateCategory(
    @Body() categoryDto: CategoryDto,
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    const udpatedCategory = await this.categoryService.updateCategory(
      id,
      categoryDto,
    );
    return this.responseSuccess(res, udpatedCategory);
  }

  /**
   * create new record in ddv_category_descriptions table
   * @param categoryDescriptionDto
   * @param res
   * @returns
   */
  @Post('description')
  @UseGuards(AuthGuard)
  async createCategoryDescription(
    @Body() categoryDescriptionDto: CategoryDescriptionDto,
    @Res() res: Response,
  ): Promise<IResponse> {
    const createdCategoryDescription =
      await this.categoryService.createCategoryDescription(
        categoryDescriptionDto,
      );
    return this.respondCreated(res, createdCategoryDescription);
  }

  /**
   * Update category description by category_id in ddv_category_descriptions
   * @param updateCategoryDescriptionDto
   * @param id
   * @param res
   * @returns
   */
  @Put('description/:id')
  @UseGuards(AuthGuard)
  async updateCategoryDescription(
    @Body() updateCategoryDescriptionDto: UpdateCategoryDescriptionDto,
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    const updatedCategoryDescription =
      await this.categoryService.updateCategoryDescription(
        id,
        updateCategoryDescriptionDto,
      );
    return this.responseSuccess(res, updatedCategoryDescription);
  }

  /**
   * Create new record in ddv_category_vendor_product_count table
   * @param createCategoryVendorProductCountDto
   * @param res
   * @returns
   */
  @Post('vendor-product-count')
  @UseGuards(AuthGuard)
  async createCategoryVendorProductCount(
    @Body()
    createCategoryVendorProductCountDto: CreateCategoryVendorProductCountDto,
    @Res() res: Response,
  ) {
    const createdCategoryVendor =
      await this.categoryService.createCategoryVendorProductCount(
        createCategoryVendorProductCountDto,
      );
    return this.respondCreated(res, createdCategoryVendor);
  }

  /**
   * get by company id in ddv_categories table
   * @param id
   * @param res
   * @returns
   */
  @Get('/company/:id')
  async getCategoryByCompanyId(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    const category = await this.categoryService.findCategoryByCompanyId(id);

    return this.responseSuccess(res, category);
  }

  /**
   * Get by id in ddv_category_descriptions table
   * @param id
   * @param res
   * @returns
   */
  @Get('description/:id')
  async getCategoryDescriptionById(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    const categoryDescription =
      await this.categoryService.findCategoryDescriptionById(id);

    return this.responseSuccess(res, categoryDescription);
  }

  /**
   * Fetch list category vendor product count with skip and limit
   * @param skip
   * @param limit
   * @param res
   * @returns
   */
  @Get('vendor-product-count')
  async getListVendorProductCount(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 10,
    @Res() res,
  ): Promise<IResponse> {
    const listVendor = await this.categoryService.fetchVendorProductCount(
      skip,
      limit,
    );
    return this.responseSuccess(res, listVendor);
  }
  /**
   * Get by id in ddv_category_vendor_product_count table
   * @param id
   * @param res
   * @returns
   */
  @Get('vendor-product-count/:id')
  async getCategoryVendorProductCountById(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    const categoryVendor =
      await this.categoryService.findCategoryVendorProductCountById(id);

    return this.responseSuccess(res, categoryVendor);
  }

  @Put('vendor-product-count/:id')
  @UseGuards(AuthGuard)
  async updateCategoryVendorProductCount(
    @Body()
    updateCategoryVendorProductCountDto: UpdateCategoryVendorProductCountDto,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const updatedCategoryVendor =
      await this.categoryService.updateCategoryVendorProductCount(
        id,
        updateCategoryVendorProductCountDto,
      );
    return this.responseSuccess(res, updatedCategoryVendor);
  }

  /**
   * Get by company id in ddv_category_vendor_product_count table
   * @param id
   * @param res
   * @returns
   */
  @Get('vendor-product-count/company/:id')
  async getCategoryVendorProductCountByCompanyId(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    const categoryVendor =
      await this.categoryService.findCategoryVendorProductCountByCompanyId(id);

    return this.responseSuccess(res, categoryVendor);
  }

  /**
   * Get by id in ddv_categories table
   * @param id
   * @param res
   * @returns
   */
  @Get('/:id')
  async getCategoryById(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    let category = await this.categoryService.findCategoryById(id);
    return this.responseSuccess(res, category);
  }

  /**
   * Delete category by category_id in ddv_categories table, then delete record in  ddv_category_vendor_product_count and ddv_category_descriptions table
   * @param id
   * @param res
   * @returns
   */
  @Delete('/:id')
  async deleteCategory(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    await this.categoryService.deleteCategory(id);
    return this.responseSuccess(res, null, 'Deleted');
  }

  /**
   * Delete category description in ddv_category_descriptions
   * @param id
   * @param res
   * @returns
   */
  @Delete('description/:id')
  async deleteCategoryDescription(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    await this.categoryService.deleteCategoryDescription(id);
    return this.responseSuccess(res, null, 'Deleted');
  }

  /**
   * Delete record by category_id in ddv_category_vendor_product_count
   * @param id
   * @param res
   * @returns
   */
  @Delete('vendor-product-count/:id')
  async deleteCategoryVendorProductCount(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    await this.categoryService.deleteCategoryVendorProductCount(id);
    return this.responseSuccess(res, null, 'Deleted');
  }
}
