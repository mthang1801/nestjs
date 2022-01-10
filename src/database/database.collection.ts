import { Injectable } from '@nestjs/common';
import { Condition } from '../base/interfaces/collection.interfaces';
export class DatabaseCollection {
  private table: string;

  private arraySort: any;
  private stringSelect: string;
  private arrayTable: any[];
  private stringJoin: string;
  private arrayCondition: any[];
  private stringCondition: string;
  private stringFilter: string;
  private limit: number;
  private offset: number;

  constructor(table) {
    this.table = table;

    this.arraySort = [];
    this.stringSelect = '';
    this.arrayTable = [];
    this.stringJoin = '';
    this.arrayCondition = [];
    this.stringCondition = ' ';
    this.stringFilter = ' ';
    this.limit = 20;
    this.offset = 0;
  }

  reset(): void {
    this.arraySort = [];
    this.stringSelect = 'SELECT t.* ';
    this.arrayTable = [];
    this.stringJoin = '';
    this.arrayCondition = [];
    this.stringCondition = ' ';
    this.stringFilter = ' ';
    this.limit = 20;
    this.offset = 0;
  }

  addSelect(arrayField: string[]): string {
    if (Array.isArray(arrayField) && arrayField.length) {
      for (let i = 0; i < arrayField.length; i++) {
        if (i === 0) {
          this.stringSelect = `SELECT ${arrayField[i]}`;
          continue;
        }
        this.stringSelect += `, ${arrayField[i]}`;
      }
    } else {
      this.stringSelect = `SELECT *`;
    }

    return this.stringSelect;
  }

  setLimit(limit): void {
    this.limit = limit;
  }

  setOffset(offset): void {
    this.offset = offset;
  }

  addJoin(table, fieldJoin, rootJoin, typeJoin = ''): string {
    this.stringJoin += ` ${typeJoin} ${table} ON ${fieldJoin} = ${rootJoin} `;
    return this.stringJoin;
  }

  join(table, fieldJoin, rootJoin, typeJoin = ''): void {
    this.stringJoin += ` ${typeJoin} JOIN ${table} ON ${fieldJoin} = ${rootJoin} `;
  }

  andWhere(field, operation, value): void {
    if (field != '') {
      if (operation == 'LIKE') {
        value = `'%${value}%'`;
      } else {
        value = `'${value}'`;
      }

      let condition = {
        connect: 'AND',
        field: field,
        operation: operation != '' ? operation : '=',
        value: value,
      };

      this.arrayCondition.push(condition);
    }
  }

  andOrWhere(field, operation, value, pos_cond): void {
    if (field != '') {
      if (operation == 'LIKE') {
        value = `'%${value}%'`;
      } else {
        value = `'${value}'`;
      }

      let condition: any = {
        operation: operation != '' ? operation : '=',
      };
      switch (pos_cond) {
        case 'first':
          condition.connect = 'AND';
          condition.field = '(' + field;
          condition.value = value;
          break;
        case 'middle':
          condition.connect = 'OR';
          condition.field = field;
          condition.value = value;
          break;
        case 'last':
          condition.connect = 'OR';
          condition.field = field;
          condition.value = value + ')';
          break;
        default:
      }

      this.arrayCondition.push(condition);
    }
  }

  orWhere(field, operation, value): void {
    if (field != '') {
      if (operation == 'LIKE') {
        value = `'%${value}%'`;
      } else {
        value = `'${value}'`;
      }

      let condition = {
        connect: 'OR',
        field: field,
        operation: operation != '' ? operation : '=',
        value: value,
      };

      this.arrayCondition.push(condition);
    }
  }

  orderBy(): string {
    let string_filter = '';
    for (let i = 0; i < this.arraySort.length; i++) {
      if (i == 0) {
        string_filter +=
          ' ORDER BY ' +
          `${this.arraySort[i].field}` +
          ` ${this.arraySort[i].sort_by}`;
      } else {
        string_filter += `, ${this.arraySort[i].field} ${this.arraySort[i].sort_by}`;
      }
    }
    this.stringFilter = string_filter;
    return this.stringFilter;
  }

  addSort(field = '', value = ''): void {
    if (field != '' && value != '') {
      let record = {
        field: field,
        sort_by: value,
      };

      this.arraySort.push(record);
    }
  }

  where(): string {
    let stringCondition = '';
    if (this.arrayCondition.length > 0) {
      let arrayCheckExist = [];
      for (let i = 0; i < this.arrayCondition.length; i++) {
        arrayCheckExist[
          this.arrayCondition[i].field + '_' + this.arrayCondition[i].value
        ] = this.arrayCondition[i];
      }

      let i = 0;
      for (var data in arrayCheckExist) {
        if (i == 0) {
          stringCondition += `WHERE ${arrayCheckExist[data].field} ${arrayCheckExist[data].operation} ${arrayCheckExist[data].value} `;
        } else {
          stringCondition += ` ${arrayCheckExist[data].connect} ${arrayCheckExist[data].field} ${arrayCheckExist[data].operation} ${arrayCheckExist[data].value} `;
        }
        i++;
      }
    }
    return stringCondition;
  }

  sqlCount(): string {
    const condition = this.where();
    const sql =
      this.arrayCondition.length === 0
        ? `SELECT count(*) AS total FROM ${this.table} t ${this.stringJoin}`
        : `SELECT count(*) AS total FROM ${this.table} t ${this.stringJoin} ${condition}`;
    return sql;
  }

  sqlById(id): string {
    let sql_string = '';
    sql_string =
      this.stringSelect +
      ` FROM ${this.table} t ` +
      this.stringJoin +
      ` WHERE t.id= ${id} LIMIT 1 `;
    this.reset();
    return sql_string;
  }

  sql(is_limit = true): string {
    let sql_string = '';
    this.stringCondition = this.where();

    sql_string =
      this.stringSelect +
      ` FROM ${this.table} t ` +
      this.stringJoin +
      this.stringCondition +
      this.orderBy();
    if (is_limit == true) {
      sql_string += ` LIMIT ${this.limit} OFFSET ${this.offset}`;
    }

    this.reset();
    return sql_string;
  }

  finallizeTotalCount(): string {
    const condition = this.genCondition();
    const sql =
      this.arrayCondition.length === 0
        ? `SELECT count(1) AS total FROM ${this.table} t ${this.stringJoin}`
        : `SELECT count(1) AS total FROM ${this.table} t ${this.stringJoin} ${condition}`;
    return sql;
  }

  finallizeTotalDistinctCount(col): string {
    const condition = this.genCondition();
    const sql =
      this.arrayCondition.length === 0
        ? `SELECT count(Distinct ${col}) AS total FROM ${this.table} t ${this.stringJoin}`
        : `SELECT count(Distinct ${col}) AS total FROM ${this.table} t ${this.stringJoin} ${condition}`;
    return sql;
  }

  genCondition(): string {
    let stringCondition = '';
    if (this.arrayCondition.length > 0) {
      let arrayCheckExist = [];
      for (let i = 0; i < this.arrayCondition.length; i++) {
        arrayCheckExist[
          this.arrayCondition[i].field + '_' + this.arrayCondition[i].value
        ] = this.arrayCondition[i];
      }

      let i = 0;
      for (var data in arrayCheckExist) {
        if (i == 0) {
          stringCondition += `WHERE ${arrayCheckExist[data].field} ${arrayCheckExist[data].operation} ${arrayCheckExist[data].value} `;
        } else {
          stringCondition += ` ${arrayCheckExist[data].connect} ${arrayCheckExist[data].field} ${arrayCheckExist[data].operation} ${arrayCheckExist[data].value} `;
        }
        i++;
      }
    }
    return stringCondition;
  }
}
