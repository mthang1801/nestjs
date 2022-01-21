import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { BaseService } from '../../base/base.service';
  import { Images } from '../entities/image.entity';
  import { ImagesRepository } from '../repositories/image.repository'
  import {
    Table,
    JoinTable,
    SortBy,
    LogicalOperator,
    ComparisonOperator,
  } from '../../database/enums/index';
  import { LoggerService } from '../../logger/custom.logger';
  
  @Injectable()
  export class ImagesService extends BaseService<
  Images,
  ImagesRepository<Images>
  > {
    constructor(
      repository: ImagesRepository<Images>,
      logger: LoggerService,
      table: Table,
    ) {
      super(repository, logger, table);
      this.table = Table.IMAGE;
    }
    async Create (data){
        return this.repository.create(data);
         
      }
  }
  