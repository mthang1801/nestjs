import { ObjectLiteral } from './common/ObjectLiteral';
// import { FindConditions } from './common/FindConditions';
export declare class AbstractRepository<Entity extends ObjectLiteral> {
  findById(id: number, table: string): Promise<Entity>;
}
