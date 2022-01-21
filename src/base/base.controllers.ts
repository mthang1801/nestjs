import { Get, Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import {
  IResponseError,
  IResponseDataSuccess,
} from '../app/interfaces/response.interface';
export class BaseController {
  private message: string = '';
  private data: any = {};
  private success: boolean = true;
  private res: any;
  private statusCode: number = 200;

  constructor() {}

  getStatusCode() {
    return this.statusCode;
  }
  setStatusCode(code: number) {
    return (this.statusCode = code);
  }

  /**
   * @param message string
   * @returns IResponseError
   */
  private responseWithError(): IResponseError {
    const data = {
      message: this.message,
      success: this.success,
      data: this.data,
    };
    return this.res.send(data);
  }

  /**
   * @param data any
   * @returns IResponseError
   */
  private respond(): IResponseDataSuccess<any> {
    let dataResponse = {
      success: this.success,
      message: this.message,
      data: typeof this.data !== 'object' ? { data: this.data } : this.data,
    };

    return this.res.status(this.statusCode).send(dataResponse);
  }

  /**
   * @description  400 - The request was invalid.
   * @param res Response
   * @param message string
   * @returns
   */
  public respondBadRequest(
    res,
    message: string = 'The request was invalid.',
  ): IResponseError {
    this.setStatusCode(400);
    this.success = false;
    this.message = message;
    this.res = res;
    return this.responseWithError();
  }

  /**
   * @description  Response 404. Not Found
   * @param res Response
   * @param message string
   * @returns
   */
  public respondNotFound(res, message: string = 'Not Found'): IResponseError {
    this.setStatusCode(404);
    this.success = false;
    this.message = message;
    this.res = res;
    return this.responseWithError();
  }

  public respondInternalError(res, message: string = 'Internal Server Error') {
    this.setStatusCode(500);
    this.success = false;
    this.message = message;
    this.res = res;
    return this.responseWithError();
  }

  /**
   * @param res Response
   * @param data any
   */
  public respondCreated(
    res,
    data = null,
    message = '',
  ): IResponseDataSuccess<any> {
    this.setStatusCode(201);
    this.success = true;
    this.data = data;
    this.res = res;
    this.message = message;
    return this.respond();
  }

  /**
   * @param res
   * @returns void
   */
  public respondNoContent(res): IResponseDataSuccess<any> {
    this.success = true;
    this.setStatusCode(204);
    this.message = '';
    this.data = {};
    this.res = res;
    return this.respond();
  }

  /**
   * @description return result when request with PUT, GET, DELETE method success
   * @param res
   * @param data
   * @returns object with code and data
   */
  public responseSuccess(
    res,
    data = null,
    message = '',
  ): IResponseDataSuccess<any> {
    this.res = res;
    this.setStatusCode(200);
    this.message = message;
    if (typeof data !== 'object') {
      this.data = { data };
    }
    this.data = data;
    return this.respond();
  }

  public optionalResponse(
    res,
    statusCode = 200,
    data: any = {},
    message: string = '',
    success: boolean = true,
  ) {
    this.res = res;
    this.setStatusCode(statusCode);
    this.data = data;
    this.message = message;
    this.success = success;
    return this.respond();
  }
}
