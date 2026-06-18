import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    let message: string | string[];

    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (isObject(errorResponse) && 'message' in errorResponse) {
      const res = errorResponse;
      message = res.message as string | string[];
    } else {
      message = 'Unexpected error';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
