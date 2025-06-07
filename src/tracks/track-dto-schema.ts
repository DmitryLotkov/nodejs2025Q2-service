import {
  object,
  minLength,
  string,
  nullable,
  number,
  pipe,
  minValue,
  integer,
  InferOutput,
} from 'valibot';
import { uuidString } from '../common/schemas/uuid-string';

export const TrackDtoSchema = object({
  name: pipe(string(), minLength(3, `Track must be at least 3 characters`)),
  artistId: nullable(uuidString()),
  albumId: nullable(uuidString()),
  duration: pipe(
    number(),
    integer('Duration must be an integer'),
    minValue(10, 'Duration must be at least 10 second'),
  ),
});

export type TrackDto = InferOutput<typeof TrackDtoSchema>;
