import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('doodll Backend Pipeline PoC')
    .setDescription(
      "Comfolabs 'doodll' - AI 디자인 생성 노드 워크플로우, 3D 인체 데이터 캐싱, BullMQ 비동기 파이프라인 PoC API",
    )
    .setVersion('0.1.0')
    .addTag('body-data')
    .addTag('design-workflow')
    .addTag('ai-tasks')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`🚀 doodll PoC server running at http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`📄 Swagger docs available at http://localhost:${port}/docs`);
}

bootstrap();
