import { Injectable, LoggerService } from '@nestjs/common';
import { LogLevel } from './LogLevel';

@Injectable()
export class LoggingService implements LoggerService {
  private levels: LogLevel[];

  constructor() {
    this.levels = (process.env.LOG_LEVELS ?? '')
      .split(',')
      .map((l) => l.trim()) as LogLevel[];
  }

  log(message: string) {
    if (this.levels.includes('log')) {
      console.log('[LOG]', message);
    }
  }

  error(message: string, trace?: string) {
    if (this.levels.includes('error')) {
      console.error(`[ERROR] ${message}`, trace);
    }
  }

  debug(message: string) {
    if (this.levels.includes('debug')) {
      console.debug(`[DEBUG] ${message}`);
    }
  }
  warn(message: string) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  }
}
