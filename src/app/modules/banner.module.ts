import { Module } from '@nestjs/common';
import { BannerController } from '../controllers/be/banner.controller';
import { BannerService } from '../services/banner.service';
import { BannerDescriptionsRepository, BannerImageRepository, BannerRepository } from '../repositories/banner.repository';
import { BannerImagesService } from '../services/banner_images.service';
import { ImageModule } from './image.module';
import { BannerDescriptionsService } from '../services/banner_description.service';
@Module({
  controllers: [BannerController],
  providers: [BannerService,BannerRepository,BannerImagesService,BannerImageRepository,BannerDescriptionsService,BannerDescriptionsRepository,String],
  exports: [BannerService,BannerImagesService,BannerDescriptionsService],
  imports :[ImageModule],

})
export class BannerModule {}