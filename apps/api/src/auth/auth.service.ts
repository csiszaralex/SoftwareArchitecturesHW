import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GoogleUser } from './interfaces/google-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthLogin(profile: GoogleUser) {
    const user = await this.prisma.user.upsert({
      where: { email: profile.email },
      update: {
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        picture: profile.picture,
      },
      create: {
        email: profile.email,
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        picture: profile.picture,
      },
    });

    return this.login(user);
  }

  login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
