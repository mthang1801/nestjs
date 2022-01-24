import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { Images } from '../entities/image.entity';
import { ImagesRepository } from '../repositories/image.repository';
import { Table } from '../../database/enums/index';

@Injectable()
export class ImagesService extends BaseService<
  Images,
  ImagesRepository<Images>
> {
  constructor(repository: ImagesRepository<Images>, table: Table) {
    super(repository, table);
    this.table = Table.IMAGE;
  }
  async Create(data) {
    return this.repository.create(data);
  }
}
