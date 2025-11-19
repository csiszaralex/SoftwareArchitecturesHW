import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { StartParkingDto } from './dto/create-parking-session.dto';

@Injectable()
export class ParkingSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async startParking(userId: string, startParkingDto: StartParkingDto) {
    const activeSession = await this.prisma.parkingSession.findFirst({
      where: { userId, isActive: true },
    });
    if (activeSession)
      throw new BadRequestException('Már van folyamatban lévő parkolásod! Előbb zárd le.');

    return this.prisma.parkingSession.create({
      data: {
        userId,
        lat: startParkingDto.lat,
        lng: startParkingDto.lng,
        address: startParkingDto.address,
        notes: startParkingDto.notes,
        endsAt: startParkingDto.endsAt,
        isActive: true,
      },
    });
  }

  async getActiveSession(userId: string) {
    return this.prisma.parkingSession.findFirst({
      where: { userId, isActive: true },
    });
  }

  async endParking(userId: string) {
    const activeSession = await this.getActiveSession(userId);
    if (!activeSession) throw new BadRequestException('Nincs aktív parkolásod.');

    return this.prisma.parkingSession.update({
      where: { id: activeSession.id },
      data: { isActive: false },
    });
  }
}
