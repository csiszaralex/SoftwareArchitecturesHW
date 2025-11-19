/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AppConfigService } from 'src/common/configs/app-config.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    // Ha ide eljutottunk, a GoogleStrategy már lefutott, és req.user tartalmazza az adatokat
    const { access_token } = await this.authService.validateOAuthLogin(req.user);

    // Visszairányítjuk a Frontend-re a tokennel
    const frontendUrl = this.configService.get('FRONTEND_URL');
    res.redirect(`${frontendUrl}/auth/success?token=${access_token}`);
  }
}
