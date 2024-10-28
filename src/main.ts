import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';
import { RootModule } from './root.module';

bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();
  await app.listen(3000);
}
