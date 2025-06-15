import { object, string } from 'valibot';

export const RefreshTokenScheme = object({
  refreshToken: string(),
});
