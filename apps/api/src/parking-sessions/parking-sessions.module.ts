import { Module } from '@nestjs/common';
import { ParkingSessionsService } from './parking-sessions.service';
import { ParkingSessionsController } from './parking-sessions.controller';

@Module({
  controllers: [ParkingSessionsController],
  providers: [ParkingSessionsService],
})
export class ParkingSessionsModule {}
