import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prismaService: PrismaService) {}

  async findSessionWithID(id: string) {
    const session = await this.prismaService.session.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    return session || null;
  }

  async deleteSession(sessionId: string) {
    console.log(
      await this.prismaService.session.delete({
        where: {
          id: sessionId,
        },
      }),
    );
  }
}
