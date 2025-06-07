import { string, pipe, minLength } from 'valibot';

export const shortString = (fieldName: string) =>
  pipe(string(), minLength(4, `${fieldName} must be at least 3 characters`));
