import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';


const PORT = 3000 

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({})

  await app.listen(PORT);
}

bootstrap();