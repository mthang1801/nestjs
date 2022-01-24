import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BaseController } from '../../../base/base.controllers';
import { CategoryService } from '../../services/category.service';
import { AuthGuard } from '../../../middlewares/be.auth';
import {
  CreateCategoryDto,
  CreateCategoryDescriptionDto,
} from '../../dto/category/create-category.dto';
import { IResponse } from '../../interfaces/response.interface';
import { Response } from 'express';
import { CreateCategoryVendorProductCountDto } from '../../dto/category/create-category.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
/**
 * Controller for Category
 * @Author MvThang
 */
@Controller('/be/v1/category')
export class CategoryController extends BaseController {
  constructor(private categoryService: CategoryService) {
    super();
  }

  @Post()
  @UseGuards(AuthGuard)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ): Promise<IResponse> {
    const createdCategory = await this.categoryService.createCategory(
      createCategoryDto,
    );
    return this.respondCreated(res, createdCategory);
  }

  @Get()
  async getCategoryList(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 10,
    @Res() res: Response,
  ) {
    const categories = await this.categoryService.getCategoryList(
      +skip,
      +limit,
    );
    return this.responseSuccess(res, categories);
  }

  @Post('description')
  @UseGuards(AuthGuard)
  async createCategoryDescription(
    @Body() createCategoryDescriptionDto: CreateCategoryDescriptionDto,
    @Res() res: Response,
  ): Promise<IResponse> {
    const createdCategoryDescription =
      await this.categoryService.createCategoryDescription(
        createCategoryDescriptionDto,
      );
    return this.respondCreated(res, createdCategoryDescription);
  }

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

  @Get('/:id')
  async getCategoryById(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    let category = await this.categoryService.findCategoryById(id);
    if (category) {
      const categoryDescription =
        await this.categoryService.findCategoryDescriptionById(
          category.category_id,
        );
      category['description'] = categoryDescription
        ? categoryDescription
        : null;
      const categoryVendor =
        await this.categoryService.findCategoryVendorProductCountById(
          category.category_id,
        );
      category['categoryVendor'] = categoryVendor ? categoryVendor : null;
    }
    return this.responseSuccess(res, category);
  }

  @Get('description/:id')
  async getCategoryDescriptionById(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    const categoryDescription =
      await this.categoryService.findCategoryDescriptionById(id);
    return this.responseSuccess(res, categoryDescription);
  }

  @Get('vendor-product-count/:id')
  async getCategoryVendorProductCountById(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    const categoryVendor =
      await this.categoryService.findCategoryVendorProductCountById(id);
    return this.responseSuccess(res, categoryVendor);
  }

  @Get('vendor-product-count/company/:id')
  async getCategoryVendorProductCountByCompanyId(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<IResponse> {
    const categoryVendor =
      await this.categoryService.findCategoryVendorProductCountByCompanyId(id);
    return this.responseSuccess(res, categoryVendor);
  }
}
