import { EntityId } from 'typeorm/repository/EntityId';
import { DeleteResult } from 'typeorm';

export interface IBaseService<T> {
  findById(
    filters: any[],
    fields: string[],
    table: string,
    filtersCond: any[],
  ): Promise<T>;
}
