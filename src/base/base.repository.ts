import {
  BadRequestException,
  ConsoleLogger,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DatabaseCollection } from '../database/database.collection';
import { Operator } from '../database/enums/operator.enum';
import { ObjectLiteral } from '../common/ObjectLiteral';
@Injectable()
export class BaseRepositorty<T> {
  constructor(protected readonly databaseService: DatabaseService) {}
  async insert(params: any, table: string): Promise<T> {
    console.log('=============== create ================');
    console.log(params);
    console.log(table);
    if (Array.isArray(params) || typeof params !== 'object') {
      throw new BadRequestException({
        message: 'Tham số truyền vào phải là Object',
      });
    }
    let sql = `INSERT INTO ${table} SET ?`;

    try {
      await this.databaseService.executeQuery(sql, params);
      let filters = [];
      for (let [key, val] of Object.entries(params)) {
        filters.push({ [key]: val });
      }

      return await this.findOne([...filters], table);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findById(id: number, table: string): Promise<T> {
    console.log('=============== Find By Id ================');
    console.log(id);
    console.log(table);

    const stringQuery = `SELECT * FROM ${table} WHERE ?`;

    try {
      const rows = await this.databaseService.executeQuery(stringQuery, [
        { id },
      ]);
      const result = rows[0];
      if (!result.length) {
        throw new NotFoundException();
      }
      return result[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findOne(
    filters: ObjectLiteral[],
    table: string,
    fields: string[] = [],
    filtersCond: string[] = [],
  ): Promise<T> {
    console.log('=============== Find One ================');
    console.log(filters);
    console.log(fields);
    console.log(table);

    const collection = new DatabaseCollection(table);
    collection.addSelect(fields);

    for (let i = 0; i < filters.length; i++) {
      for (let [key, val] of Object.entries(filters[i])) {
        if (!filtersCond.length || filtersCond[i] === Operator.AND) {
          collection.andWhere(key, '=', val);
        } else {
          collection.orWhere(key, '=', val);
        }
      }
    }

    try {
      const rows = await this.databaseService.executeQuery(collection.sql());
      return rows[0][0];
    } catch (error) {
      throw new BadRequestException();
    }
  }

  /**
   *
   * @param filters bộ lọc truy vấn các ràng buộc trong thuộc tính của field
   * @param table tên bảng
   * @param params tham số cần update
   * @param filtersCond toán tử liên kết giữa các filter với nhau
   * @returns
   */
  async update(
    filters: any[],
    table: string,
    params: any[],
    filtersCond: any[] = [],
  ): Promise<boolean> {
    console.log('=============== update ================');
    console.log(filters);
    console.log(params);
    console.log(table);

    let sql = `UPDATE ${table} SET `;
    for (let i = 0; i < params.length; i++) {
      Object.entries(params[i]).forEach(([key, val], j) => {
        if (j === 0 && i === 0) {
          sql +=
            typeof val === 'number' ? `${key} = ${val}` : `${key} = '${val}'`;
        } else {
          sql +=
            typeof val === 'number'
              ? `, ${key} = ${val}`
              : `, ${key} = '${val}'`;
        }
      });
    }
    for (let i = 0; i < filters.length; i++) {
      for (let [key, val] of Object.entries(filters[i])) {
        if (i === 0) {
          sql +=
            typeof val === 'number'
              ? ` WHERE ${key} = ${val} ${filtersCond[i] || ''} `
              : ` WHERE ${key} = '${val}' ${filtersCond[i] || ''} `;
        } else {
          sql +=
            typeof val === 'number'
              ? `${key} = ${val} ${filtersCond[i] || ''} `
              : `${key} = '${val}' ${filtersCond[i] || ''} `;
        }
      }
    }

    try {
      await this.databaseService.executeQuery(sql);
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteById(id: number, table: string): Promise<boolean> {
    console.log('=============== delete ================');
    console.log(id);
    const queryString = `DELETE FROM ${table} WHERE ?`;
    try {
      const res = await this.databaseService.executeQuery(queryString, [
        { id },
      ]);
      if (res[0].affectedRows === 0) {
        throw new NotFoundException({
          message: `Not found category with id = ${id} to delete`,
        });
      }
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
