import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AppConfigService } from '../../common/configs/app-config.service';

export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  accessToken: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: AppConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const { name, emails, photos } = profile;

    const email = emails?.[0]?.value;
    if (!email) {
      done(new UnauthorizedException('Google account must have an email'), undefined);
      return;
    }

    const user: GoogleUser = {
      email,
      firstName: name?.givenName || '', // Fallback üres stringre undefined helyett
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value,
      accessToken,
    };

    done(null, user);
  }
}
