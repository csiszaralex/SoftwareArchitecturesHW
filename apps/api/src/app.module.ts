import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './common/configs/appConfig.service';
import { envSchema } from './common/configs/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      validate: config => envSchema.parse(config),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule {}
