import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingService } from './logger/logger.service';
import * as process from 'node:process';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';
import { Reflector } from '@nestjs/core';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggingService);

  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);

  app.useGlobalGuards(new AuthGuard(jwtService, reflector));

  process.on('uncaughtException', (err) => {
    logger.error(' Uncaught Exception', err.stack || err.message);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    const message =
      reason instanceof Error ? reason.stack || reason.message : String(reason);

    logger.error('Unhandled Rejection', message);
  });

  app.enableShutdownHooks();

  await app.listen(PORT);
}
void bootstrap();
