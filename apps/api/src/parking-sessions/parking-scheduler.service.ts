import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ParkingSchedulerService {
  private readonly logger = new Logger(ParkingSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();

    const expiredSessions = await this.prisma.parkingSession.findMany({
      where: {
        isActive: true,
        endsAt: { lte: now },
        reminderSent: false,
      },
    });

    if (expiredSessions.length === 0) {
      return;
    }

    this.logger.log(`Lejárt parkolások ellenőrzése: ${expiredSessions.length} találat.`);

    for (const session of expiredSessions) {
      try {
        await this.notificationsService.sendNotificationToUser(session.userId, {
          title: 'Parkolás lejárt! ⏰',
          body: `A parkolásod itt: ${session.address || 'GPS Pozíció'} ideje lejárt.`,
          url: '/map',
        });

        await this.prisma.parkingSession.update({
          where: { id: session.id },
          data: { reminderSent: true },
        });

        this.logger.log(`Értesítés elküldve usernek: ${session.userId}`);
      } catch (error) {
        this.logger.error(`Hiba a cron értesítés küldésekor (Session: ${session.id})`, error);
      }
    }
  }
}
