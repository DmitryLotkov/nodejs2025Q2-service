import {
  object,
  pipe,
  number,
  integer,
  minValue,
  maxValue,
  InferOutput,
  string,
  uuid,
  nullable,
} from 'valibot';
import { shortString } from '../common/schemas/short-string';

const currentYear = new Date().getFullYear();
export const AlbumDtoSchema = object({
  name: shortString('Album'),
  year: pipe(
    number(),
    integer('Year must be an integer'),
    minValue(1800, 'Year of album creation must be at least 1800 second'),
    maxValue(
      currentYear,
      `Year of album creation must be maximum ${currentYear}`,
    ),
  ),
  artistId: nullable(pipe(string(), uuid())),
});

export type AlbumDto = InferOutput<typeof AlbumDtoSchema>;
