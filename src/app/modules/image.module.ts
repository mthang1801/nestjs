import { Module } from '@nestjs/common';
import { ImagesLinksRepository, ImagesRepository } from '../repositories/image.repository';
import { ImagesService } from '../services/image.service';
import { ImagesLinksService } from '../services/image_link.service';

@Module({
    providers: [ImagesService,ImagesRepository,ImagesLinksService,ImagesLinksRepository,String],
    exports: [ImagesService,ImagesLinksService],

})
export class ImageModule {}