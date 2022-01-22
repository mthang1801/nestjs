import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { BaseService } from '../../base/base.service';
  import { BannerImages } from '../entities/banner.entity';
  import { BannerImageRepository } from '../repositories/banner.repository'
  import {
    Table,
    JoinTable,
    SortBy,
    LogicalOperator,
    ComparisonOperator,
  } from '../../database/enums/index';
  import { LoggerService } from '../../logger/custom.logger';
import { ObjectLiteral } from 'src/common/ObjectLiteral';
  
  @Injectable()
  export class BannerImagesService extends BaseService<
  BannerImages,
  BannerImageRepository<BannerImages>
  > {
    constructor(
      repository: BannerImageRepository<BannerImages>,
      logger: LoggerService,
      table: Table,
    ) {
      super(repository, logger, table);
      this.table = Table.BANNER_IMAGE;
    }
    async Create (data){
      return this.repository.create(data);
       
    }
    async findById(id: number): Promise<BannerImages> {
      return this.repository.findById(id);
    }
  }
  