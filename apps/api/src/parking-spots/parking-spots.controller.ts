import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { ParkingSpotsService } from './parking-spots.service';

@Controller('parking-spots')
export class ParkingSpotsController {
  constructor(private readonly parkingSpotsService: ParkingSpotsService) {}

  @Post()
  @ApiOperation({ summary: 'Új parkolóhely létrehozása' })
  @ApiResponse({ status: 201, description: 'A parkoló sikeresen létrehozva.' })
  create(@Body() createParkingSpotDto: CreateParkingSpotDto) {
    return this.parkingSpotsService.create(createParkingSpotDto);
  }

  @Get()
  @ApiOperation({ summary: 'Összes parkoló listázása' })
  findAll() {
    return this.parkingSpotsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Egy konkrét parkoló lekérése ID alapján' })
  findOne(@Param('id') id: string) {
    return this.parkingSpotsService.findOne(id);
  }
}
