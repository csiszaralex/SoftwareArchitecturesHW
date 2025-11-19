import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './common/configs/appConfig.service';
import { envSchema } from './common/configs/env.validation';
import { PrismaModule } from './common/prisma/prisma.module';
import { AppConfigModule } from './common/configs/appConfig.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      validate: config => envSchema.parse(config),
    }),
    PrismaModule,
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule {}
