import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionService } from 'src/session/session.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.SESSION_DURATION,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, SessionService, JwtStrategy],
})
export class AuthModule {}
