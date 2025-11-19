import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { SearchParkingSpotDto } from './dto/search-parking-spot.dto';
import { ParkingSpotsService } from './parking-spots.service';

@Controller('parking-spots')
export class ParkingSpotsController {
  constructor(private readonly parkingSpotsService: ParkingSpotsService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Új parkolóhely létrehozása' })
  @ApiResponse({ status: 201, description: 'A parkoló sikeresen létrehozva.' })
  create(@Body() createParkingSpotDto: CreateParkingSpotDto, @CurrentUser() user: User) {
    return this.parkingSpotsService.create(createParkingSpotDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Parkolók listázása (opcionálisan távolság alapján)' })
  findAll(@Query() query: SearchParkingSpotDto) {
    return this.parkingSpotsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Egy konkrét parkoló lekérése ID alapján' })
  findOne(@Param('id') id: string) {
    return this.parkingSpotsService.findOne(id);
  }
}
