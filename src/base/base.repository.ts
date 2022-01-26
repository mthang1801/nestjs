import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DatabaseCollection } from '../database/database.collection';
import { Table, PrimaryKeys } from '../database/enums/index';
import { HttpStatus } from '@nestjs/common';
import { preprocessDatabaseBeforeResponse } from '../utils/helper';

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
      throw new HttpException(
        'The injected argument need to be an Object',
        HttpStatus.BAD_REQUEST,
      );
    }
    let sql = `INSERT INTO ${this.table} SET ? ;`;

    await this.databaseService.executeQuery(sql, params);
    const res = await this.databaseService.executeQuery(
      'SELECT LAST_INSERT_ID();',
    );
    let filters = [];
    for (let [key, val] of Object.entries(params)) {
      filters.push({ [key]: val });
    }
    return this.findById(res[0][0]['LAST_INSERT_ID()']);
  }

  /**
   * Show one record by primary key id
   * @param id
   * @returns
   */
  async findById(id: number | any): Promise<T> {
    console.log('=============== Find By Id ================');

    const stringQuery = `SELECT * FROM ${this.table} WHERE ?`;

    let rows;
    if (typeof id === 'object') {
      rows = await this.databaseService.executeQuery(stringQuery, [id]);
    } else {
      rows = await this.databaseService.executeQuery(stringQuery, [
        { [PrimaryKeys[this.table]]: id },
      ]);
    }

    const result = rows[0];

    return preprocessDatabaseBeforeResponse(result[0]);
  }

  /**
   * Find one record by item
   * @param options
   * @returns
   */
  async findOne(options: any): Promise<any> {
    console.log('=============== FIND ONE ================');

    const results = await this.find({ ...options, limit: 1 });

    return preprocessDatabaseBeforeResponse(results[0]);
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

    const res = await this.databaseService.executeQuery(collection.sql());
    let results: any[] = [];

    for (let result of res[0]) {
      results.push(preprocessDatabaseBeforeResponse(result));
    }
    return results;
  }

  /**
   * Update one record by primary key
   * @param id primary key
   * @param params object<any> with
   * @returns
   */
  async update(id: number | any, params: any): Promise<T> {
    console.log('=============== UPDATE ================');

    if (typeof params !== 'object') {
      throw new HttpException(
        'The injected argument is invalid',
        HttpStatus.BAD_REQUEST,
      );
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
    sql += ' WHERE ';
    if (typeof id === 'object') {
      Object.entries(id).forEach(([key, val], i) => {
        if (i === 0) {
          sql +=
            typeof val === 'number' ? `${key} = ${val}` : `${key} = '${val}'`;
        } else {
          sql +=
            typeof val === 'number'
              ? ` AND ${key} = ${val}`
              : ` AND ${key} = '${val}'`;
        }
      });
    } else {
      sql += ` ${PrimaryKeys[this.table]} = '${id}'`;
    }

    await this.databaseService.executeQuery(sql);

    const updatedUser =
      typeof id === 'object' ? await this.findOne(id) : await this.findById(id);
    return updatedUser;
  }

  async delete(id: number | any): Promise<boolean> {
    console.log('=============== DELETE BY ID ================');

    const queryString = `DELETE FROM ${this.table} WHERE ?`;
    let res;
    if (typeof id === 'object') {
      res = await this.databaseService.executeQuery(queryString, [id]);
    } else {
      res = await this.databaseService.executeQuery(queryString, [
        { [PrimaryKeys[this.table]]: id },
      ]);
    }

    if (res[0].affectedRows === 0) {
      throw new HttpException(
        `Not found id = ${id} in ${this.table} to delete`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }
}
