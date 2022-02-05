import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilterTest implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception?.response?.message || exception.response;
    console.log(exception.response);
    res.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toLocaleString(),
      path: req.url,
    });
  }
}
