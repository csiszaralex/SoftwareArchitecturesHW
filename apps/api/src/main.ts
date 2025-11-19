import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { AppConfigService } from './common/configs/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const configService = app.get(AppConfigService);
  const port = configService.get('PORT');

  app.useGlobalPipes(new ZodValidationPipe());

  CreateSwagger(app);
  app.enableCors();
  await app.listen(port);
}

function CreateSwagger(app: INestApplication) {
  const TITLE = 'Parking App API';
  const configSW = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(TITLE)
    .setDescription('API dokumentáció a parkoló alkalmazáshoz')
    .setVersion('0.1.0') //TODO: automatikus verzió kezelés
    .build();
  const documentOptions: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
  };
  const customOptions: SwaggerCustomOptions = {
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customSiteTitle: TITLE,
  };

  const document = SwaggerModule.createDocument(app, configSW, documentOptions);
  SwaggerModule.setup('api', app, document, customOptions);
}

void bootstrap();
