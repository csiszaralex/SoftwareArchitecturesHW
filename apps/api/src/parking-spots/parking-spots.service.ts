import { Injectable } from '@nestjs/common';
import { ParkingSpot, Prisma } from '@prisma/client';
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
    const { lat, lng, radius, searchTerm, category } = query || {};

    const where: Prisma.ParkingSpotWhereInput = {};

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { address: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = category;
    }

    if (lat && lng) {
      const rawWhereClause = this.buildRawWhereClause(searchTerm, category);
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
        ${rawWhereClause}
        ORDER BY distance ASC
      `;
      return spots;
    }
    return this.prisma.parkingSpot.findMany({
      where,
      include: { creator: { select: { name: true, picture: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
  private buildRawWhereClause(searchTerm?: string, category?: string): Prisma.Sql {
    const filters: Prisma.Sql[] = [];

    if (searchTerm) {
      filters.push(Prisma.sql`
        AND ("name" ILIKE ${'%' + searchTerm + '%'} OR "address" ILIKE ${'%' + searchTerm + '%'})
      `);
    }

    if (category) {
      filters.push(Prisma.sql`
        AND "category" = ${category}::"ParkingCategory"
      `);
    }

    return filters.length > 0 ? Prisma.sql`${Prisma.join(filters, ' ')}` : Prisma.empty;
  }

  findOne(id: string) {
    return this.prisma.parkingSpot.findUniqueOrThrow({ where: { id } });
  }
}
