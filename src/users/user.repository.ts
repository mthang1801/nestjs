import { ConsoleLogger, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DatabaseCollection } from '../collections/database.collection';
import { Operator } from '../database/enums/operator.enum';
@Injectable()
export class DatabaseRepository {
  constructor(private readonly databaseService: DatabaseService) {}
  async insert(params, table) {
    console.log('=============== create ================');
    console.log(params);
    console.log(table);

    let sql = `INSERT INTO ${table} SET ?`;
    return new Promise(async (resolve, reject) => {
      try {
        await this.databaseService.executeQuery(sql, params);
        const user = await this.findOne(
          [{ email: params.email }, { phone: params.phone }],
          [],
          table,
        );
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  async findOne(
    filters: any[],
    fields: string[],
    table: string,
    filtersCond = [],
  ) {
    console.log('=============== Find One ================');
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
    return new Promise(async (resolve, reject) => {
      try {
        const rows = await this.databaseService.executeQuery(collection.sql());

        resolve(rows[0][0]);
      } catch (error) {
        reject(error);
      }
    });
  }

  async update(
    filters: any[],
    params: any[],
    table: string,
    filtersCond: any[],
  ) {
    console.log('=============== update ================');
    console.log(filters);
    console.log(params);
    console.log(table);
    let sql = `UPDATE ${table} SET `;
    for (let i = 0; i < params.length; i++) {
      for (let [key, val] of Object.entries(params[i])) {
        if (i === 0) {
          sql +=
            typeof val === 'number' ? `${key} = ${val}` : `${key} = '${val}'`;
        } else {
          sql +=
            typeof val === 'number' ? `${key} = ${val}` : `, ${key} = '${val}'`;
        }
      }
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
    return new Promise(async (resolve, reject) => {
      try {
        await this.databaseService.executeQuery(sql);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}
