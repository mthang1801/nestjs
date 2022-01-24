import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BannerService } from '../../services/banner.service';
import { BaseController } from '../../../base/base.controllers';
import {
  BannerCreateDTO,
  createBannerImageDTO,
  UpdateBannerDTO,
} from '../../dto/banner/banner.dto';
@Controller('banner')
export class BannerController extends BaseController {
  constructor(private bannerService: BannerService) {
    super();
  }
  @Get()
  getAllBanners(): any {
    const banners = this.bannerService.getAllBanner();
    return banners;
  }
  @Get('/:id')
  getAllBannersById(@Param('id') id): any {
    const banners = this.bannerService.getBannerById(id);
    return banners;
  }
  @Get('/:id/images')
  getAllIamgesByBannerId(@Param('id') id): any {
    return `this action return all images from banner`;
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBanner(@Body() body: BannerCreateDTO): any {
    const banner = this.bannerService.CreateBanner(body);
    return banner;
  }
  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateBannerbyId(@Body() body: UpdateBannerDTO, @Param('id') id): any {
    const banner = this.bannerService.UpdateBanner(body, id);
    return banner;
  }
  @Delete('/:banner_id/images/:images_id')
  deleteBannerById(
    @Param('banner_id') banner_id,
    @Param('images_id') images_id,
  ): any {
    const banner = this.bannerService.DeleteBanner(banner_id, images_id);

    return banner;
  }
  @Post('/:id/createimages')
  @UsePipes(ValidationPipe)
  createBannerImage(@Body() body: createBannerImageDTO): any {
    const banner = this.bannerService.createBannerImage(body);
    return banner;
  }
}
