import { EntityId } from 'typeorm/repository/EntityId';
import { DeleteResult } from 'typeorm';
import { ObjectLiteral } from '../common/ObjectLiteral';
export interface IBaseService<T> {
  findById(id: number): Promise<T>;
  findOne(options: any): Promise<T>;
  deleteById(id: number): Promise<boolean | any>;
}
