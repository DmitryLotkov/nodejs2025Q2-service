import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { LoggingService } from '../../logger/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let issues: unknown;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const { code, meta } = exception;

      const isStringArray = (v: unknown): v is string[] =>
        Array.isArray(v) && v.every((t) => typeof t === 'string');

      if (code === 'P2002') {
        const target = meta?.target;
        message = isStringArray(target)
          ? `Unique constraint failed on field(s): ${target.join(', ')}`
          : 'Unique constraint failed';
        status = HttpStatus.BAD_REQUEST;
      }

      if (code === 'P2025') {
        message = 'Record not found';
        status = HttpStatus.NOT_FOUND;
      }

      if (!['P2002', 'P2025'].includes(code)) {
        message = `Database error (code ${code})`;
        status = HttpStatus.BAD_REQUEST;
      }
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      }

      if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, any>;
        message = r.message ?? message;
        issues = r.issues;
      }
    }

    const logMsg = `[Exception] ${request.method} ${request.url} → ${status} :: ${typeof message === 'string' ? message : JSON.stringify(message)}`;
    this.logger.error(logMsg);

    response.status(status).json({
      status,
      error: HttpStatus[status],
      message,
      issues,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
