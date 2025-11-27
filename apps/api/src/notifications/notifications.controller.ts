import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import type { UserPayload } from 'src/auth/interfaces/user-payload.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('public-key')
  getPublicKey() {
    return this.notificationsService.getPublicKey();
  }

  @Post('subscribe')
  @UseGuards(JwtGuard)
  subscribe(@CurrentUser() user: UserPayload, @Body() subscription: CreateSubscriptionDto) {
    return this.notificationsService.subscribe(user.id, subscription);
  }
}
