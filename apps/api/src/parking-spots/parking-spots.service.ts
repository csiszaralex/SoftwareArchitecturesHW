import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';

@Injectable()
export class ParkingSpotsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createParkingSpotDto: CreateParkingSpotDto, userId: string) {
    return this.prisma.parkingSpot.create({
      data: {
        ...createParkingSpotDto,
        creatorId: userId,
      },
    });
  }

  findAll() {
    return this.prisma.parkingSpot.findMany({
      include: { creator: { select: { name: true, picture: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.parkingSpot.findUniqueOrThrow({ where: { id } });
  }
}
