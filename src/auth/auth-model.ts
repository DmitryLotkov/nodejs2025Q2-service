import { JwtPayload } from 'jsonwebtoken';

export interface RefreshToken {
  refreshToken: string;
}

export interface AuthTokens extends RefreshToken {
  accessToken: string;
}

export interface Jwt extends JwtPayload {
  userId: string;
  login: string;
  iat?: number; // issued at
  exp?: number; // expiration time
}
