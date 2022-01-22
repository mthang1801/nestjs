import {
  BadRequestException,
  ConsoleLogger,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DatabaseCollection } from '../database/database.collection';
import { Table, PrimaryKeys } from '../database/enums/index';

@Injectable()
export class BaseRepositorty<T> {
  constructor(
    protected readonly databaseService: DatabaseService,
    protected table: Table,
  ) {
    this.table = table;
  }

  /**
   * Create new record
   * @param params
   * @returns
   */
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

  /**
   * Show one record by primary key id
   * @param id
   * @returns
   */
  async findById(id: number): Promise<T> {
    console.log('=============== Find By Id ================');

    const stringQuery = `SELECT * FROM ${this.table} WHERE ?`;

    try {
      const rows = await this.databaseService.executeQuery(stringQuery, [
        { [PrimaryKeys[this.table]]: id },
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

  /**
   * Find one record by item
   * @param options
   * @returns
   */
  async findOne(options: any): Promise<any> {
    console.log('=============== FIND ONE ================');
    try {
      const results = await this.find({ ...options, limit: 1 });

      return results[0];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Find items by multi filters
   * @param options
   * @returns array
   */
  async find(options: any): Promise<any[]> {
    console.log('=============== FIND ================');
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
   * Update one record by primary key
   * @param id primary key
   * @param params object<any> with
   * @returns
   */
  async update(id: number, params: any): Promise<T> {
    console.log('=============== UPDATE BY ID ================');
    if (typeof params !== 'object') {
      throw new BadRequestException({
        message: 'Tham số truyền vào không thể nhận dạng key/value.',
      });
    }
    let sql = `UPDATE ${this.table} SET `;
    Object.entries(params).forEach(([key, val], i) => {
      if (i === 0) {
        sql +=
          typeof val === 'number' ? `${key} = ${val}` : `${key} = '${val}'`;
      } else {
        sql +=
          typeof val === 'number' ? `, ${key} = ${val}` : `, ${key} = '${val}'`;
      }
    });

    sql += ` WHERE ${PrimaryKeys[this.table]} = '${id}'`;
    try {
      await this.databaseService.executeQuery(sql);
      const updatedUser = await this.findById(id);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    console.log('=============== DELETE BY ID ================');

    const queryString = `DELETE FROM ${this.table} WHERE ?`;
    try {
      const res = await this.databaseService.executeQuery(queryString, [
        { id },
      ]);
      if (res[0].affectedRows === 0) {
        throw new NotFoundException({
          message: `Not found id = ${id} in ${this.table} to delete`,
        });
      }
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
