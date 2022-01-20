import { Get, Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import {
  IResponseError,
  IResponseDataSuccess,
} from '../app/interfaces/response.interface';
export class BaseController {
  private statusCode: number = 200;
  private res: any;

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
  private responseWithError(message: string): IResponseError {
    const data = {
      error: {
        message,
        statusCode: this.statusCode,
      },
    };
    return this.res.status(this.statusCode).send(data);
  }

  /**
   * @param data any
   * @returns IResponseError
   */
  private respond(data: any): IResponseDataSuccess<any> {
    let dataResponse = {
      statusCode: this.statusCode,
    };
    if (data) {
      dataResponse['data'] = data;
    }
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
    this.res = res;
    return this.responseWithError(message);
  }

  /**
   * @description  Response 404. Not Found
   * @param res Response
   * @param message string
   * @returns
   */
  public respondNotFound(res, message: string = 'Not Found'): IResponseError {
    this.setStatusCode(404);
    this.res = res;
    return this.responseWithError(message);
  }

  public respondInternalError(res, message: string = 'Internal Server Error') {
    this.setStatusCode(500);
    this.res = res;
    return this.responseWithError(message);
  }

  /**
   * @param res Response
   * @param data any
   */
  public respondCreated(res, data = null): IResponseDataSuccess<any> {
    this.setStatusCode(201);
    this.res = res;

    return this.respond(data);
  }

  /**
   * @param res
   * @returns void
   */
  public respondNoContent(res): void {
    return this.res.status(204).send({ code: 204 });
  }

  /**
   * @description return result when request with PUT, GET, DELETE method success
   * @param res
   * @param data
   * @returns object with code and data
   */
  public responseSuccess(res, data = null): IResponseDataSuccess<any> {
    return res
      .status(this.statusCode)
      .send({ statusCode: this.statusCode, data });
  }
}
