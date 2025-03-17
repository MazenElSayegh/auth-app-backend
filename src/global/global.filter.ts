import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/common/services/logger.service';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const message = exception.message || 'Internal server error';

    this.logger.error(`Exception: ${message}`, exception.stack);

    response.status(status).json({
      statusCode: status,
      message: 'Something went wrong. Please try again later.',
    });
  }
}
