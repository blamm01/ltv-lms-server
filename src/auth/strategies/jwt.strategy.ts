import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport/dist';
import { SessionPayload } from 'src/typings/SessionPayload';
import { SessionService } from 'src/session/session.service';
import { UnauthorizedException } from '@nestjs/common';
import { getText } from 'src/utils/getText';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly sessionService: SessionService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: SessionPayload) {
    const session = await this.sessionService.findSessionWithID(
      payload.sessionId,
    );

    if (!session) throw new UnauthorizedException(getText('INVALID_SESSION'));
    if (!session.user) {
      await this.sessionService.deleteSession(session.id);
      throw new UnauthorizedException(getText('NO_USER_FOUND'));
    } else if (!this.authService.isAbleToLogin(session.user)) {
      await this.sessionService.deleteSession(session.id);
      throw new UnauthorizedException(getText('USER_DEACTIVATED'));
    }

    return {
      session,
      user: session.user,
    };
  }
}
