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
  protected table: Table;
  constructor(repository: R, logger: LoggerService, table: Table) {
    this.repository = repository;
    this.logger = logger;
    this.table = table;
  }
  deleteById(id: number): Promise<boolean> {
    return this.repository.deleteById(id);
  }

  findById(id: number): Promise<T> {
    this.logger.warn(
      'Đừng thay đổi field id thành tên khác, (tạm thời chưa update)',
    );
    return this.repository.findById(id);
  }

  findOne(options: ObjectLiteral): Promise<T> {
    return this.repository.findOne(options);
  }

  find(options: any): Promise<any[]> {
    return this.repository.find(options);
  }
}
