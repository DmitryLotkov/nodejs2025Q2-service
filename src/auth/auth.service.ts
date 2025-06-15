import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto, User } from '../users/user-entity';
import * as bcrypt from 'bcrypt';
import { User as PrismaUser } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';
import { AuthTokens, RefreshToken, Jwt } from './auth-model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(dto: CreateUserDto): Promise<AuthTokens> {
    const user = await this.validateUser(dto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { userId: user.id, login: user.login };
    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(dto: CreateUserDto): Promise<PrismaUser | null> {
    const users = await this.usersService.findByLogin(dto.login);

    for (const user of users) {
      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (isMatch) {
        return user;
      }
    }

    return null;
  }

  async signUp(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    return this.usersService.signUp(dto);
  }

  async refresh(refreshTokenDto: RefreshToken): Promise<AuthTokens> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload: Jwt = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      const newAccessToken = this.createAccessToken(payload);
      const newRefreshToken = this.createRefreshToken(payload);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private createAccessToken(payload: Jwt): string {
    const { userId, login } = payload;
    return this.jwtService.sign(
      { userId, login },
      {
        expiresIn: process.env.TOKEN_EXPIRE_TIME ?? '1h',
        secret: process.env.JWT_SECRET_KEY,
      },
    );
  }

  private createRefreshToken(payload: Jwt): string {
    const { userId, login } = payload;
    return this.jwtService.sign(
      { userId, login },
      {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME ?? '24h',
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      },
    );
  }
}
