import { Body, Controller, Post } from '@nestjs/common';
import { Category } from './categories.entity';
@Controller('categories')
export class CategoriesController {
  @Post()
  async createCategory(
    @Body('categoryName') categoryName: string,
  ): Promise<void> {
    console.log(categoryName);
  }
}
