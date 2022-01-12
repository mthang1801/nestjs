import { ObjectLiteral } from '../common/ObjectLiteral';

export declare class AbstractRepository<Entity extends ObjectLiteral> {
  findById(id: number, table: string): Promise<Entity>;
  findOne(
    filters: ObjectLiteral[],
    fields: string[],
    table: string,
    filterCond: string[],
  ): Promise<Entity>;
  deleteById(id: number, table: string): Promise<boolean | any>;
}
