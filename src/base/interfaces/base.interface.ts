import { EntityId } from 'typeorm/repository/EntityId';
import { DeleteResult } from 'typeorm';
import { ObjectLiteral } from '../common/ObjectLiteral';
export interface IBaseService<T> {
  findById(id: number, table: string): Promise<T>;
  findOne(dataObj: ObjectLiteral[]): Promise<T>;
}
