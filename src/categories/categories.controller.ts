import {
  Body,
  Controller,
  Post,
  Param,
  Put,
  Get,
  Delete,
  Res,
  Response,
} from '@nestjs/common';
import { Category } from './categories.entity';
import { Observable } from 'rxjs';
import { CategoriesService } from './categories.service';
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Post()
  async createCategory(
    @Body('categoryName') categoryName: string,
    @Res() res,
  ): Promise<Category> {
    const category = await this.categoriesService.createCategory(categoryName);
    return res.send({ statusCode: res.statusCode, data: category });
  }
  @Get(':id')
  async getCategoryByID(
    @Param('id') id: number,
    @Res() res,
  ): Promise<Category | any> {
    const category = await this.categoriesService.findById(id);
    res.send({ statusCode: res.statusCode, data: category });
  }
  @Put(':id')
  async updateCategoryName(
    @Param('id') id: number,
    @Body('categoryName') categoryName: string,
    @Res() res,
  ): Promise<void> {
    await this.categoriesService.updateCategoryName(id, categoryName);
    res.send({ statusCode: res.statusCode, message: 'updated' });
  }
  @Delete(':id')
  async deleteCategory(@Param('id') id: number, @Res() res): Promise<void> {
    await this.categoriesService.deleteById(id);
    res.send({ statusCode: res.statusCode, message: 'deleted' });
  }
}
