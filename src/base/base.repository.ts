import { ObjectLiteral } from './common/ObjectLiteral';
// import { FindConditions } from './common/FindConditions';
export declare class Repository<Entity extends ObjectLiteral> {
  findOne(
    filters: any[],
    fields: any[],
    table: string,
    filtersCond: any[],
  ): Promise<Entity>;
}
