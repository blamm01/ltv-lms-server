import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginEntity } from './entity/AuthLogin.entity';
import { getText } from 'src/utils/getText';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { SessionPayload } from 'src/typings/SessionPayload';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async login(
    username: string,
    password: string,
    ip: string | null,
  ): Promise<AuthLoginEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException(getText('NO_USER_FOUND'));
    } else if (
      !(await this.bcryptService.comparePassword(password, user.password))
    ) {
      throw new UnauthorizedException(getText('INVALID_CREDENTIALS'));
    }

    this.isAbleToLogin(user);

    const session = await this.prismaService.session.create({
      data: {
        userId: user.id,
        ipAddress: ip == null ? [] : [ip],
      },
    });

    return {
      accessToken: this.jwtService.sign(
        {
          userId: user.id,
          sessionId: session.id,
        } as SessionPayload,
        {},
      ),
    };
  }

  isAbleToLogin(user: User): boolean {
    if (user.status != 'ACTIVE')
      throw new UnauthorizedException(getText('USER_DEACTIVATED'));
    return true;
  }
}
