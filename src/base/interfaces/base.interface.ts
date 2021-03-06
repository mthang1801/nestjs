import { EntityId } from 'typeorm/repository/EntityId';
import { DeleteResult } from 'typeorm';
import { ObjectLiteral } from '../common/ObjectLiteral';
export interface IBaseService<T> {
  findById(id: number): Promise<T>;
  findOne(options: any): Promise<T>;
  delete(id: number): Promise<boolean>;
}
