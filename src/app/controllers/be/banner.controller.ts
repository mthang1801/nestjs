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
import {BannerCreateDTO} from '../../dto/banner-create.dto'
@Controller('banner')
export class BannerController extends BaseController{
  constructor(private bannerService: BannerService) {
    super();
  }
  @Get()
  getAllBanners(): any {
    const banners = this.bannerService.getAllBanner();
    return banners;
  }
  @Get('/:id')
  getAllBannersById(@Param('id') id): string {
    return `This action returns banner id ${id}`;
  }

  @Post()
  @UsePipes(ValidationPipe)

  createBanner(@Body() body: BannerCreateDTO): any {
    const banner = this.bannerService.CreateBanner(body)
  }
  @Put('/:id')
  updateBannerbyId(@Body() body, @Param('id') id): string {
    return `this action update a banner`;
  }
  @Delete('/:id')
  deleteBannerById(@Param('id') id) : any{
      return `this action delete a banner`
  }
}
