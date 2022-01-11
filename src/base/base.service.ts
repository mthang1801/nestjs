import { Repository } from './base.repository';
import { IBaseService } from './interfaces/base.interface';
import { LoggerService } from '../logger/custom.logger';
export class BaseService<T, R extends Repository<T>>
  implements IBaseService<T>
{
  protected readonly logger: LoggerService;
  protected readonly repository: R;
  constructor(repository: R, logger: LoggerService) {
    this.repository = repository;
    this.logger = logger;
  }

  findById(
    filters: any[],
    fields: string[],
    table: string,
    filtersCond: any[],
  ): Promise<T | any> {
    return this.repository.findOne(filters, fields, table, filtersCond);
  }
}
