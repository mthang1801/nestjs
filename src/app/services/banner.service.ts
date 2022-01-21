import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { Banner } from '../entities/banner.entity';
import { BannerRepository } from '../repositories/banner.repository';
import { BannerCreateDTO } from '../dto/banner-create.dto';
import { BannerImagesService } from './banner_images.service';
import { BannerDescriptionsService } from './banner_description.service';
import { ImagesService } from './Image.service';
import { ImagesLinksService } from './image_link.service';

import {
  Table,
  JoinTable,
  SortBy,
  LogicalOperator,
  ComparisonOperator,
} from '../../database/enums/index';
import { LoggerService } from '../../logger/custom.logger';
import { convertToMySQLDateTime } from 'src/utils/helper';

@Injectable()
export class BannerService extends BaseService<
  Banner,
  BannerRepository<Banner>
> {
  constructor(
    repository: BannerRepository<Banner>,
    logger: LoggerService,
    table: Table,
    private bannerImagesService: BannerImagesService,
    private imageService: ImagesService,
    private imageLinkService: ImagesLinksService,
    private bannerDescriptionsService: BannerDescriptionsService,
  ) {
    super(repository, logger, table);
    this.table = Table.BANNER;
  }
  async getAllBanner() {
    const banner = await this.repository.find({
      select: ['*'],
      join: {
        [JoinTable.join]: {
          ddv_banner_images: { fieldJoin: 'banner_id', rootJoin: 'banner_id' },
          ddv_banner_descriptions: {
            fieldJoin: 'banner_id',
            rootJoin: 'banner_id',
          },
        },
      },

      skip: 0,
      limit: 30,
    });
    return banner;
  }
  async CreateBanner(data: BannerCreateDTO) {
    ////=====================| Flow|====================
    ///=== admin hoặc client sẽ truyền vào 2 thuộc tính quan trọng là tên banner, hinh cua banner
    //== optional description

    try {
      const {
        status,
        type,
        target,
        localization,
        position,
        image_url,
        banner,
        description,
        url,
        image_x,
        image_y,
        is_high_res,
      } = data;
      ///==========================|Add to ddve_banner table|==============
      const bannerTableData = {
        status: status,
        type: type,
        target: target,
        localization: localization,
        position: position,
        created_at: convertToMySQLDateTime(),
      };
      Object.keys(bannerTableData).forEach(
        (key) =>
          bannerTableData[key] === undefined && delete bannerTableData[key],
      );
      let _banner = await this.repository.create(bannerTableData);
      //===========================|Add to ddve_banner description|======
      const bannerDescriptionTableData = {
        banner_id: _banner.banner_id,
        banner: banner,
        url: url,
        description: description,
      };
      Object.keys(bannerDescriptionTableData).forEach(
        (key) =>
          bannerDescriptionTableData[key] === undefined &&
          delete bannerDescriptionTableData[key],
      );
      let _banner_description = await this.bannerDescriptionsService.Create(
        bannerDescriptionTableData,
      );
      //===========================|Add to ddve_images |=============================
      const imageTableData = {
        image_path: image_url,
        image_x: image_x,
        image_y: image_y,
        is_high_res: is_high_res,
      };
      Object.keys(imageTableData).forEach(
        (key) =>
        imageTableData[key] === undefined &&
          delete imageTableData[key],
      );
      let _images = await this.imageService.Create(
        imageTableData,
      );
      //===========================|Add to ddve_images_links|=============================
      const imageLinkTableData = {
        object_id: _banner.banner_id,
        object_type: 'banners',
        image_id: _images.image_id,
        position: position,
      };
      Object.keys(imageLinkTableData).forEach(
        (key) =>
        imageLinkTableData[key] === undefined &&
          delete imageLinkTableData[key],
      );
      let _images_link = await this.imageLinkService.Create(
        imageLinkTableData,
      );
      //===========================|Add to ddve_banner_images|=============================
      const bannerImageTableData = {
        banner_id: _banner.banner_id,
        banner_image_id: _images.image_id,
      };
      Object.keys(bannerImageTableData).forEach(
        (key) =>
        bannerImageTableData[key] === undefined &&
          delete bannerImageTableData[key],
      );
      let _banner_image = await this.bannerImagesService.Create(
        bannerImageTableData,
      );

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
