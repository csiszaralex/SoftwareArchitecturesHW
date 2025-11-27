import { Module } from '@nestjs/common';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ParkingSchedulerService } from './parking-scheduler.service';
import { ParkingSessionsController } from './parking-sessions.controller';
import { ParkingSessionsService } from './parking-sessions.service';

@Module({
  imports: [NotificationsModule],
  controllers: [ParkingSessionsController],
  providers: [ParkingSessionsService, ParkingSchedulerService],
})
export class ParkingSessionsModule {}
