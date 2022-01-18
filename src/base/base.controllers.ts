import { Get, Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import {
  IResponseMessage,
  IResponseData,
  IResponseDataSuccess,
} from '../app/interfaces/response.interface';
export class BaseController {
  private statusCode: number = 200;
  protected res: any;
  getStatusCode() {
    return this.statusCode;
  }
  setStatusCode(code: number) {
    return (this.statusCode = code);
  }

  /**
   *
   * @param message string
   * @returns IResponseMessage
   */
  responseWithError(message: string): IResponseMessage {
    const data = {
      error: {
        message,
        code: this.statusCode,
      },
    };
    return this.res.status(this.statusCode).send(data);
  }
  /**
   *
   * @param data any
   * @returns IResponseMessage
   */
  respond(data: any): IResponseDataSuccess<any> {
    let dataResponse = {
      code: this.statusCode,
    };
    if (data) {
      dataResponse['data'] = data;
    }
    return this.res.status(this.statusCode).send(dataResponse);
  }

  /**
   * @Describe  400 - The request was invalid.
   * @param res Response
   * @param message string
   * @returns
   */
  public respondBadRequest(
    res,
    message: string = 'The request was invalid.',
  ): IResponseMessage {
    this.setStatusCode(400);
    this.res = res;
    return this.responseWithError(message);
  }

  /**
   * @Describe  Response 404. Not Found
   * @param res Response
   * @param message string
   * @returns
   */
  public respondNotFound(res, message: string = 'Not Found'): IResponseMessage {
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
   *
   * @param res Response
   * @param data any
   */
  public respondCreated(res, data = null): IResponseDataSuccess<any> {
    this.setStatusCode(201);
    this.res = res;

    return this.respond(data);
  }

  /**
   *
   * @param res
   * @returns void
   */
  public respondNoContent(res): void {
    return this.res.status(204).send({ code: 204 });
  }

  public responseSuccess(res, data = null): IResponseDataSuccess<any> {
    return res.status(200).send({ code: this.statusCode, data });
  }
}
