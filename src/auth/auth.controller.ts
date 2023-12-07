import { Body, Controller, Ip, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dtos/login.dto';
import { AuthLoginEntity } from './entity/AuthLogin.entity';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthLoginEntity })
  @UseGuards(AuthGuard('jwt'))
  login(@Body() body: LoginDTO, @Ip() ip: string) {
    return this.authService.login(body.username, body.password, ip);
  }
}
