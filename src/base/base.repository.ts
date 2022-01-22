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

  InternalServerError(
    message: string | string[] = 'Có lỗi xảy ra từ hệ thống.',
  ) {
    return {
      statusCode: 500,
      message,
    };
  }

  BadRequestError(message: string | string[] = 'Bad request.') {
    return {
      statusCode: 400,
      message,
    };
  }

  ErrorNotFound(message: string | string[] = 'Not Found.') {
    return {
      statusCode: 404,
      message,
    };
  }

  ErrorDoNothing(
    statusCode: number = 400,
    message: string | string[] = 'Something went wrong.',
  ) {
    return {
      statusCode: statusCode,
      message,
    };
  }

  /**
   * Create new record
   * @param params
   * @returns
   */
  async create(params: any): Promise<any> {
    console.log('=============== create ================');
    return new Promise(async (resolve, reject) => {
      if (Array.isArray(params) || typeof params !== 'object') {
        return reject(
          this.BadRequestError('Tham số truyền vào phải là Object'),
        );
      }
      let sql = `INSERT INTO ${this.table} SET ?`;

      try {
        await this.databaseService.executeQuery(sql, params);
        let filters = [];
        for (let [key, val] of Object.entries(params)) {
          filters.push({ [key]: val });
        }

        resolve(this.findOne({ where: params }));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Show one record by primary key id
   * @param id
   * @returns
   */
  async findById(id: number): Promise<T> {
    console.log('=============== Find By Id ================');
    return new Promise(async (resolve, reject) => {
      try {
        const stringQuery = `SELECT * FROM ${this.table} WHERE ?`;

        const rows = await this.databaseService.executeQuery(stringQuery, [
          { [PrimaryKeys[this.table]]: id },
        ]);
        const result = rows[0];

        resolve(result[0]);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Find one record by item
   * @param options
   * @returns
   */
  async findOne(options: any): Promise<any> {
    console.log('=============== FIND ONE ================');
    return new Promise(async (resolve, reject) => {
      try {
        const results = await this.find({ ...options, limit: 1 });

        resolve(results[0]);
      } catch (error) {
        reject(error);
      }
    });
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

    return new Promise(async (resolve, reject) => {
      try {
        const results = await this.databaseService.executeQuery(
          collection.sql(),
        );

        resolve(results[0]);
      } catch (error) {
        reject(this.InternalServerError(error));
      }
    });
  }

  /**
   * Update one record by primary key
   * @param id primary key
   * @param params object<any> with
   * @returns
   */
  async update(id: number, params: any): Promise<T> {
    console.log('=============== UPDATE BY ID ================');
    return new Promise(async (resolve, reject) => {
      if (typeof params !== 'object') {
        return reject(
          this.BadRequestError(
            "'Tham số truyền vào không thể nhận dạng key/value.'",
          ),
        );
      }
      let sql = `UPDATE ${this.table} SET `;
      Object.entries(params).forEach(([key, val], i) => {
        if (i === 0) {
          sql +=
            typeof val === 'number' ? `${key} = ${val}` : `${key} = '${val}'`;
        } else {
          sql +=
            typeof val === 'number'
              ? `, ${key} = ${val}`
              : `, ${key} = '${val}'`;
        }
      });

      sql += ` WHERE ${PrimaryKeys[this.table]} = '${id}'`;
      try {
        await this.databaseService.executeQuery(sql);
        const updatedUser = await this.findById(id);
        resolve(updatedUser);
      } catch (error) {
        reject(error);
      }
    });
  }

  async delete(id: number): Promise<boolean> {
    console.log('=============== DELETE BY ID ================');

    const queryString = `DELETE FROM ${this.table} WHERE ?`;
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.databaseService.executeQuery(queryString, [
          { id },
        ]);
        if (res[0].affectedRows === 0) {
          return reject(
            this.ErrorDoNothing(
              200,
              `Not found id = ${id} in ${this.table} to delete`,
            ),
          );
        }
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}
