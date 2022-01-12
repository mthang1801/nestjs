import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { DatabaseModule } from '../database/database.module';
import { LoggerModule } from '../logger/logger.module';
@Module({
  imports: [DatabaseModule, LoggerModule],
  providers: [CategoriesService, CategoriesRepository],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
