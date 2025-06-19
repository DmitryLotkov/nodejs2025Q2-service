import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggingService } from './logger.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const { method, url, query, body } = request;
    const now = Date.now();

    this.logger.log(
      `➡️ ${method} ${url} | query: ${JSON.stringify(query)} | body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(
          `⬅️ ${method} ${url} | ${response.statusCode} | ${duration}ms`,
        );
      }),
    );
  }
}
