import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PushSubscriptionInput } from '@parking/schema';
import { AppConfigService } from 'src/common/configs/app-config.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as webPush from 'web-push';

interface WebPushError extends Error {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
}

function isWebPushError(error: unknown): error is WebPushError {
  return typeof error === 'object' && error !== null && 'statusCode' in error && 'body' in error;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
  ) {}

  onModuleInit() {
    webPush.setVapidDetails(
      this.config.get('VAPID_SUBJECT'),
      this.config.get('VAPID_PUBLIC_KEY'),
      this.config.get('VAPID_PRIVATE_KEY'),
    );
  }

  getPublicKey() {
    return { publicKey: this.config.get('VAPID_PUBLIC_KEY') };
  }

  async subscribe(userId: string, subscription: PushSubscriptionInput) {
    // Ellenőrizzük, létezik-e már (idempotencia)
    const exists = await this.prisma.pushSubscription.findUnique({
      where: { endpoint: subscription.endpoint },
    });

    if (exists) return exists;

    return this.prisma.pushSubscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });
  }

  async sendNotificationToUser(
    userId: string,
    payload: { title: string; body: string; url?: string },
  ) {
    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId },
    });

    const notifications = subscriptions.map(async sub => {
      try {
        await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
      } catch (error: unknown) {
        // JAVÍTÁS 2: 'unknown' használata 'any' helyett

        if (isWebPushError(error)) {
          // Ha 410 (Gone) vagy 404 (Not Found), akkor a feliratkozás már érvénytelen
          if (error.statusCode === 410 || error.statusCode === 404) {
            this.logger.warn(`Feliratkozás lejárt/törölve, adatbázis tisztítása: ${sub.id}`);
            await this.prisma.pushSubscription.delete({ where: { id: sub.id } });
          } else {
            this.logger.error(`WebPush hiba (${error.statusCode}): ${error.body}`);
          }
        } else {
          // Egyéb, nem WebPush eredetű hiba (pl. hálózati hiba)
          this.logger.error(`Váratlan hiba értesítés küldésekor:`, error);
        }
      }
    });

    await Promise.all(notifications);
  }
}
