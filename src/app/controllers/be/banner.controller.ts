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
  UseGuards,
  Res
} from '@nestjs/common';
import { BannerService } from '../../services/banner.service';
import { BaseController } from '../../../base/base.controllers';
import { IResponse } from '../../interfaces/response.interface';

import {
  BannerCreateDTO,
  createBannerImageDTO,
  UpdateBannerDTO,
} from '../../dto/banner/banner.dto';
import { } from '../../interfaces/response.interface';
import { AuthGuard } from '../../../middlewares/fe.auth';
@Controller('/be/v1/banner')
export class BannerController extends BaseController {
  constructor(private bannerService: BannerService) {
    super();
  }

  @Get()
  async getAllBanners(@Res() res,
  ): Promise<IResponse> {
    const banners = await this.bannerService.getAllBanner();
    return this.responseSuccess(res, banners);
  }

  @Get('/:id')
  async getAllBannersById(@Res() res,@Param('id') id): Promise<IResponse> {
    const banners = await this.bannerService.getBannerById(id);
    return this.responseSuccess(res, banners);
  }

  @Get('/:id/images')
  async getAllIamgesByBannerId(@Res() res,@Param('id') id): Promise<IResponse> {
    const banners = await this.bannerService.getAllIamgesByBannerId(id);
    return this.responseSuccess(res, banners);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async createBanner(@Res() res,@Body() body: BannerCreateDTO): Promise<IResponse> {
    const banner = await this.bannerService.CreateBanner(body);
    return this.respondCreated(res, banner);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async updateBannerbyId(@Res() res,@Body() body: UpdateBannerDTO, @Param('id') id): Promise<IResponse> {
    const banner = await this.bannerService.UpdateBanner(body, id);
    return this.respondCreated(res, banner);
  }

  @Delete('/:banner_id/images/:images_id')
  @UseGuards(AuthGuard)
  async deleteBannerById(@Res() res,
    @Param('banner_id') banner_id,
    @Param('images_id') images_id,
  ): Promise<IResponse> {
    const banner = await this.bannerService.DeleteBanner(banner_id, images_id);

    return this.respondCreated(res, banner);
  }

  @Post('/:id/createimages')
  @UsePipes(ValidationPipe)
  // @UseGuards(AuthGuard)
  async createBannerImage(@Res() res,@Body() body: createBannerImageDTO,@Param('id') id): Promise<IResponse> {
    const banner = await this.bannerService.createBannerImage(body,id);
    return this.respondCreated(res, banner);
  }
}
