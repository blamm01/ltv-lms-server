import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const salt = process.env.BCRYPT_SALT;

@Injectable()
export class BcryptService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password,
      (await bcrypt.genSalt(parseInt(salt))) || 12,
    );
  }

  async comparePassword(plain: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(plain, encrypted);
  }
}
