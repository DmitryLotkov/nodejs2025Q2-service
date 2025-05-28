import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {GlobalExceptionFilter} from "./common/filter/http-exeption.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(4000);
}
void bootstrap();
