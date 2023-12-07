//src/auth/entity/auth.entity.ts
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginEntity {
  @ApiProperty()
  accessToken: string;
}
