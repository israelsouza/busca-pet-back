import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Express } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { AppModule } from '../app.module';

export function setupApp(app: INestApplication): INestApplication {
  app.setGlobalPrefix('api', { exclude: ['health'] });
  app.useGlobalPipes(new ZodValidationPipe());
  app.enableCors();
  return app;
}

export async function bootstrapLocal(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running locally on port: ${port}`);
}

export async function bootstrapLambda(expressInstance: Express): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));
  setupApp(app);
  return app;
}
