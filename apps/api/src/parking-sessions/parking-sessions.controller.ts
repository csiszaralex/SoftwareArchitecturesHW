import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { StartParkingDto } from './dto/create-parking-session.dto';
import { ParkingSessionsService } from './parking-sessions.service';

@ApiTags('Parking Sessions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('parking-sessions')
export class ParkingSessionsController {
  constructor(private readonly parkingSessionsService: ParkingSessionsService) {}

  @Post('start')
  @ApiOperation({ summary: 'Parkolás indítása az aktuális helyen' })
  start(@CurrentUser() user: { id: string }, @Body() dto: StartParkingDto) {
    return this.parkingSessionsService.startParking(user.id, dto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Aktív parkolás lekérdezése (ha van)' })
  getActive(@CurrentUser() user: { id: string }) {
    return this.parkingSessionsService.getActiveSession(user.id);
  }

  @Post('end')
  @ApiOperation({ summary: 'Parkolás lezárása (Elhajtottam)' })
  end(@CurrentUser() user: { id: string }) {
    return this.parkingSessionsService.endParking(user.id);
  }
}
