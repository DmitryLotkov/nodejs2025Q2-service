import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as rfs from 'rotating-file-stream';
import * as path from 'node:path';
import * as fs from 'node:fs';

const LOG_LEVELS: LogLevel[] = ['debug', 'log', 'warn', 'error', 'verbose'];
@Injectable()
export class LoggingService implements LoggerService {
  private readonly level: number;
  private readonly maxSize: string;
  private logStream: rfs.RotatingFileStream;
  private errorStream: rfs.RotatingFileStream;

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    const levelEnv = (process.env.LOG_LEVEL ?? 'log') as LogLevel;

    this.level = LOG_LEVELS.indexOf(levelEnv);
    if (this.level === -1) {
      this.level = 1;
    }

    this.maxSize = process.env.MAX_LOG_FILE_SIZE ?? '100K';

    this.logStream = rfs.createStream('app.log', {
      size: this.maxSize,
      interval: '1d',
      path: logDir,
      compress: 'gzip',
    });

    this.errorStream = rfs.createStream('error.log', {
      size: this.maxSize,
      interval: '1d',
      path: logDir,
      compress: 'gzip',
    });
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS.indexOf(level) >= this.level;
  }

  private format(level: string, message: string): string {
    return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
  }

  log(message: string) {
    if (this.shouldLog('log')) {
      const formatted = this.format('log', message);
      this.logStream.write(formatted + '\n');
      console.log(formatted);
    }
  }

  warn(message: string) {
    if (this.shouldLog('warn')) {
      const formatted = this.format('warn', message);
      this.logStream.write(formatted + '\n');
      console.warn(formatted);
    }
  }

  debug(message: string) {
    if (this.shouldLog('debug')) {
      const formatted = this.format('debug', message);
      this.logStream.write(formatted + '\n');
      console.debug(formatted);
    }
  }

  verbose(message: string) {
    if (this.shouldLog('verbose')) {
      const formatted = this.format('verbose', message);
      this.logStream.write(formatted + '\n');
      console.debug(formatted);
    }
  }

  error(message: string, trace?: string) {
    const formatted = this.format(
      'error',
      message + (trace ? `\n${trace}` : ''),
    );
    this.errorStream.write(formatted + '\n');
    if (this.shouldLog('error')) {
      this.logStream.write(formatted + '\n');
      console.error(formatted);
    }
  }
}
