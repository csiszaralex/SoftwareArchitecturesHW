import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './common/configs/app-config.module';
import { AppConfigService } from './common/configs/app-config.service';
import { envSchema } from './common/configs/env.validation';
import { PrismaModule } from './common/prisma/prisma.module';
import { ParkingSpotsModule } from './parking-spots/parking-spots.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { ParkingSessionsModule } from './parking-sessions/parking-sessions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      validate: config => envSchema.parse(config),
    }),
    ScheduleModule.forRoot(),
    LoggerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        return {
          pinoHttp: {
            transport: !config.isProduction
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                    translateTime: 'SYS:standard',
                  },
                }
              : undefined,
            autoLogging: {
              ignore: req => req.url === '/health' || req.url === '/api-docs',
            },
          },
        };
      },
    }),
    PrismaModule,
    AppConfigModule,
    ParkingSpotsModule,
    AuthModule,
    UploadsModule,
    ParkingSessionsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule {}
