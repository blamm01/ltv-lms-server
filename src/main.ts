import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Config
  app.enableCors();
  app.use(helmet());
  app.set('trust proxy', 'loopback');

  await app.listen(3000);
}
bootstrap();
