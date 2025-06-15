import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';

const LOG_LEVELS: LogLevel[] = ['debug', 'log', 'warn', 'error', 'verbose'];

@Injectable()
export class LoggingService implements LoggerService {
  private readonly level: number;
  private readonly maxSize: number; // in bytes
  private readonly logDir: string;
  private readonly logFilePath: string;
  private readonly errorFilePath: string;

  constructor() {
    const isDocker = process.env.NODE_ENV === 'production';
    this.logDir = isDocker ? '/app/logs' : path.join(process.cwd(), 'logs');

    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch (err) {
      console.error('Failed to create log directory:', err);
    }

    const levelEnv = (process.env.LOG_LEVEL ?? 'log') as LogLevel;
    this.level = LOG_LEVELS.indexOf(levelEnv);
    if (this.level === -1) this.level = 1;

    this.maxSize = this.parseSize(process.env.MAX_LOG_FILE_SIZE ?? '100K');
    this.logFilePath = path.join(this.logDir, 'app.log');
    this.errorFilePath = path.join(this.logDir, 'error.log');
  }

  private parseSize(sizeStr: string): number {
    const match = sizeStr.match(/^(\d+)([kKmM]?)/);
    if (!match) return 1024 * 100;
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (unit === 'k') return value * 1024;
    if (unit === 'm') return value * 1024 * 1024;
    return value;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS.indexOf(level) >= this.level;
  }

  private format(level: string, message: string): string {
    return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
  }

  private rotateIfNeeded(filePath: string) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > this.maxSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedName = filePath.replace(/\.log$/, `-${timestamp}.log`);
        fs.renameSync(filePath, rotatedName);
        fs.writeFileSync(filePath, '');
      }
    } else {
      fs.writeFileSync(filePath, '');
    }
  }

  private write(filePath: string, message: string) {
    this.rotateIfNeeded(filePath);
    fs.appendFileSync(filePath, message + '\n');
  }

  log(message: string) {
    if (this.shouldLog('log')) {
      const formatted = this.format('log', message);
      this.write(this.logFilePath, formatted);
      console.log(formatted);
    }
  }

  warn(message: string) {
    if (this.shouldLog('warn')) {
      const formatted = this.format('warn', message);
      this.write(this.logFilePath, formatted);
      console.warn(formatted);
    }
  }

  debug(message: string) {
    if (this.shouldLog('debug')) {
      const formatted = this.format('debug', message);
      this.write(this.logFilePath, formatted);
      console.debug(formatted);
    }
  }

  verbose(message: string) {
    if (this.shouldLog('verbose')) {
      const formatted = this.format('verbose', message);
      this.write(this.logFilePath, formatted);
      console.debug(formatted);
    }
  }

  error(message: string, trace?: string) {
    const formatted = this.format(
      'error',
      message + (trace ? `\n${trace}` : ''),
    );
    this.write(this.errorFilePath, formatted);
    if (this.shouldLog('error')) {
      this.write(this.logFilePath, formatted);
      console.error(formatted);
    }
  }
}
