import {
  BadRequestException,
  ConsoleLogger,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DatabaseCollection } from '../database/database.collection';
import { Operator, Table } from '../database/enums/index';
import { ObjectLiteral } from '../common/ObjectLiteral';

@Injectable()
export class BaseRepositorty<T> {
  constructor(
    protected readonly databaseService: DatabaseService,
    protected table: Table,
  ) {
    this.table = table;
  }
  async create(params: any): Promise<any> {
    console.log('=============== create ================');

    if (Array.isArray(params) || typeof params !== 'object') {
      throw new BadRequestException({
        message: 'Tham số truyền vào phải là Object',
      });
    }
    let sql = `INSERT INTO ${this.table} SET ?`;

    try {
      await this.databaseService.executeQuery(sql, params);
      let filters = [];
      for (let [key, val] of Object.entries(params)) {
        filters.push({ [key]: val });
      }

      return await this.findOne({ where: params });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findById(id: number): Promise<T> {
    console.log('=============== Find By Id ================');

    const stringQuery = `SELECT * FROM ${this.table} WHERE ?`;

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
  async findOne(options: any): Promise<any> {
    console.log('=============== Find One ================');
    try {
      const results = await this.find({ ...options, limit: 1 });
      return results[0];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async find(options: any): Promise<any[]> {
    console.log('=============== Find ================');
    console.log(options);
    const optionKeys = Object.keys(options);
    const orderCmds = [
      'select',
      'from',
      'join',
      'where',
      'skip',
      'limit',
      'orderBy',
    ];

    const collection = new DatabaseCollection(this.table);
    for (let cmd of orderCmds) {
      if (optionKeys.includes(cmd)) {
        if (cmd === 'skip') {
          collection['setSkip'](options[cmd]);
          continue;
        }
        if (cmd === 'limit') {
          collection['setLimit'](options[cmd]);
          continue;
        }
        collection[cmd](options[cmd]);
      }
    }

    try {
      const results = await this.databaseService.executeQuery(collection.sql());
      return results[0];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   *
   * @param filters bộ lọc truy vấn các ràng buộc trong thuộc tính của field
   * @param params tham số cần update
   * @returns
   */
  async updateOne(filters: any | any[], params: any): Promise<T> {
    console.log('=============== update ================');

    const findOneByFilters = await this.findOne(filters);

    let sql = `UPDATE ${this.table} SET `;
    Object.entries(params).forEach(([key, val], i) => {
      if (i === 0) {
        sql +=
          typeof val === 'number' ? `${key} = ${val}` : `${key} = '${val}'`;
      }
      sql +=
        typeof val === 'number' ? `, ${key} = ${val}` : `, ${key} = '${val}'`;
    });

    sql += ` WHERE id = '${findOneByFilters.id}'`;

    try {
      await this.databaseService.executeQuery(sql, [
        { id: findOneByFilters.id },
      ]);
      const updatedOne = await this.findById(findOneByFilters.id);
      return updatedOne;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteById(id: number): Promise<boolean> {
    console.log('=============== DELETE BY ID ================');

    const queryString = `DELETE FROM ${this.table} WHERE ?`;
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

  async deleteOne(filters: any | any[]): Promise<any> {
    console.log('=============== DELETE ONE ================');
    const findOneByFilters = await this.findOne(filters);
    try {
      return this.deleteById(findOneByFilters.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
