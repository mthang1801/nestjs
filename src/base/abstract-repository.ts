import { ObjectLiteral } from '../common/ObjectLiteral';

export declare class AbstractRepository<Entity extends ObjectLiteral> {
  findById(id: number): Promise<Entity>;
  findOne(options: any): Promise<Entity>;
  deleteById(id: number, table: string): Promise<boolean>;
  find(options: any): Promise<any[]>;
}
