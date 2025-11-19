import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';

@Injectable()
export class ParkingSpotsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createParkingSpotDto: CreateParkingSpotDto) {
    const firstUser = await this.prisma.user.findFirst();

    if (!firstUser) throw new Error('Nincs User az adatbázisban! Futtass Seed-et!');

    return this.prisma.parkingSpot.create({
      data: {
        ...createParkingSpotDto,
        creatorId: firstUser.id,
      },
    });
  }

  findAll() {
    return this.prisma.parkingSpot.findMany({
      include: { creator: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.parkingSpot.findUniqueOrThrow({ where: { id } });
  }
}
