import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValibotPipe } from '../common/pipes/valibot.pipe';
import { CreateUserSchema } from '../users/user.schema';
import { CreateUserDto } from '../users/user-entity';
import { RefreshTokenScheme } from './refresh-token.scheme';
import { RefreshToken } from './auth-model';
import { safeParse } from 'valibot';
import { Public } from './public-decorator';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('/login')
  login(@Body(new ValibotPipe(CreateUserSchema)) dto: CreateUserDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('/signup')
  signUp(@Body(new ValibotPipe(CreateUserSchema)) dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  refresh(@Body() dto: RefreshToken) {
    const result = safeParse(RefreshTokenScheme, dto);
    if (!result.success) {
      throw new UnauthorizedException('Invalid or missing refresh token');
    }

    return this.authService.refresh(dto);
  }
}
