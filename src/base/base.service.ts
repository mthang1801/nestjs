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
  protected table = Table.USERS;
  constructor(repository: R, logger: LoggerService) {
    this.repository = repository;
    this.logger = logger;
  }

  findById(id: number, table: string): Promise<T> {
    return this.repository.findById(id, table);
  }

  findOne(dataObj: ObjectLiteral): Promise<T> {
    return this.repository.findOne([dataObj], [], this.table, []);
  }
}
