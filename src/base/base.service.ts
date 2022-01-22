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
  delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  findById(id: number): Promise<T> {
    return this.repository.findById(id);
  }

  findOne(options: ObjectLiteral): Promise<T> {
    return this.repository.findOne(options);
  }

  find(options: any): Promise<any[]> {
    return this.repository.find(options);
  }

  update(id: number, params: any): Promise<T> {
    return this.repository.update(id, params);
  }

  create(params): Promise<T> {
    return this.repository.create(params);
  }

  responseSuccess(data: any = null, message: string = '') {
    return {
      statusCode: 200,
      message,
      data,
    };
  }

  responseError(statusCode: number = 500, message: string | string[] = '') {
    return {
      statusCode,
      message,
      data: null,
    };
  }

  errorNotFound(message: string = '') {
    return {
      statusCode: 404,
      message,
      data: null,
    };
  }

  optionalResponse(
    statusCode: number = 200,
    message: string = '',
    data: any = null,
  ) {
    return {
      statusCode,
      data,
      message,
    };
  }
}
