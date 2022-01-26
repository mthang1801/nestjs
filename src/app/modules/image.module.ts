import { Module, Global } from '@nestjs/common';
import {
  ImagesLinksRepository,
  ImagesRepository,
} from '../repositories/image.repository';
import { ImagesService } from '../services/image.service';
import { ImagesLinksService } from '../services/image_link.service';
@Global()
@Module({
  providers: [
    ImagesService,
    ImagesRepository,
    ImagesLinksService,
    ImagesLinksRepository,
  ],
  exports: [
    ImagesService,
    ImagesLinksService,
    ImagesRepository,
    ImagesLinksRepository,
  ],
})
export class ImageModule {}
