import { AbstractRepository } from './abstract-repository';
import { IBaseService } from './interfaces/base.interface';
import { LoggerService } from '../logger/custom.logger';
import { ObjectLiteral } from '../common/ObjectLiteral';
import { Table } from '../database/enums/tables.enum';

export abstract class BaseService<T, R extends AbstractRepository<T>>
  implements IBaseService<T>
{
  protected readonly logger: LoggerService;
  protected readonly repository: R;
  protected table: string;
  constructor(repository: R, logger: LoggerService) {
    this.repository = repository;
    this.logger = logger;
    this.table = '';
  }
  deleteById(id: number): Promise<any> {
    throw new Error('Method not implemented.');
  }

  findById(id: number): Promise<T> {
    this.logger.warn(
      'Đừng thay đổi field id thành tên khác, (tạm thời chưa update)',
    );
    return this.repository.findById(id, this.table);
  }

  findOne(dataObj: ObjectLiteral): Promise<T> {
    return this.repository.findOne([dataObj], this.table, [], []);
  }
}
