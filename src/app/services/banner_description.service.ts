import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { BaseService } from '../../base/base.service';
  import { BannerDescriptions } from '../entities/banner.entity';
  import { BannerDescriptionsRepository } from '../repositories/banner.repository'
  import {
    Table,
    JoinTable,
    SortBy,
    LogicalOperator,
    ComparisonOperator,
  } from '../../database/enums/index';
  import { LoggerService } from '../../logger/custom.logger';
  
  @Injectable()
  export class BannerDescriptionsService extends BaseService<
  BannerDescriptions,
  BannerDescriptionsRepository<BannerDescriptions>
  > {
    constructor(
      repository: BannerDescriptionsRepository<BannerDescriptions>,
      logger: LoggerService,
      table: Table,
    ) {
      super(repository, logger, table);
      this.table = Table.BANNER_DESCRIPTIONS;
    }

    async Create (data){
      return this.repository.create(data);
       
    }
  }
  