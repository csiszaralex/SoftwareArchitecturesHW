import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../common/configs/app-config.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: AppConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const rawToken = req.get('Authorization')?.replace('Bearer ', '').trim();

    if (rawToken) {
      const isBlacklisted = await this.prisma.tokenBlacklist.findUnique({
        where: { token: rawToken },
      });

      if (isBlacklisted) {
        throw new UnauthorizedException('Kijelentkezve. Kérlek lépj be újra.');
      }
    }

    return { id: payload.sub, email: payload.email };
  }
}