import { Module } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategoryController } from '../controllers/be/category.controller';
import {
  CategoryDescriptionRepository,
  CategoryRepository,
  CategoryVendorProductCountRepository,
} from '../repositories/category.repository';

@Module({
  providers: [
    CategoryService,
    CategoryDescriptionRepository,
    CategoryRepository,
    CategoryVendorProductCountRepository,
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}
