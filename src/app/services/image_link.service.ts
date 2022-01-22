import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { BaseService } from '../../base/base.service';
  import { ImagesLinks } from '../entities/image.entity';
  import { ImagesLinksRepository } from '../repositories/image.repository'
  import {
    Table,
    JoinTable,
    SortBy,
    LogicalOperator,
    ComparisonOperator,
  } from '../../database/enums/index';
  import { LoggerService } from '../../logger/custom.logger';
  
  @Injectable()
  export class ImagesLinksService extends BaseService<
  ImagesLinks,
  ImagesLinksRepository<ImagesLinks>
  > {
    constructor(
      repository: ImagesLinksRepository<ImagesLinks>,
      logger: LoggerService,
      table: Table,
    ) {
      super(repository, logger, table);
      this.table = Table.IMAGE_LINK;
    }
    async Create (data){
      return this.repository.create(data);
       
    }
  }
  