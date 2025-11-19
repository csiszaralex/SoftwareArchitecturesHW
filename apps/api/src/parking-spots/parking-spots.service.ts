import { Injectable } from '@nestjs/common';
import { ParkingSpot } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { SearchParkingSpotDto } from './dto/search-parking-spot.dto';

type ParkingSpotWithDistance = ParkingSpot & { distance: number };
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

  async findAll(query?: SearchParkingSpotDto) {
    if (!query || !query.lat || !query.lng) {
      return this.prisma.parkingSpot.findMany({
        include: { creator: { select: { name: true, picture: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    }

    const { lat, lng, radius } = query;
    const spots: ParkingSpotWithDistance[] = await this.prisma.$queryRaw`
      SELECT
        id, name, description, address, lat, lng, category, images, "createdAt", "creatorId",
        (
          6371000 * acos(
            cos(radians(${lat})) * cos(radians(lat)) *
            cos(radians(lng) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(lat))
          )
        ) AS distance
      FROM "ParkingSpot"
      WHERE (
        6371000 * acos(
          cos(radians(${lat})) * cos(radians(lat)) *
          cos(radians(lng) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(lat))
        )
      ) < ${radius}
      ORDER BY distance ASC
    `;
    return spots;
  }

  findOne(id: string) {
    return this.prisma.parkingSpot.findUniqueOrThrow({ where: { id } });
  }
}
