import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Loggin.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // MDLV
  app.useGlobalInterceptors(new LoggingInterceptor()); // MDLV
  await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
