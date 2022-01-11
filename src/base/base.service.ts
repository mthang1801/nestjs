import { AbstractRepository } from './abstract-repository';
import { IBaseService } from './interfaces/base.interface';
import { LoggerService } from '../logger/custom.logger';

export interface ObjType {
  [name: string]: string;
}
export abstract class BaseService<T, R extends AbstractRepository<T>>
  implements IBaseService<T>
{
  protected readonly logger: LoggerService;
  protected readonly repository: R;
  constructor(repository: R, logger: LoggerService) {
    this.repository = repository;
    this.logger = logger;
  }

  findById(id: number, table: string): Promise<T> {
    return this.repository.findById(id, table);
  }
}
