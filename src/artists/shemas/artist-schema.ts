import { object } from 'valibot';
import { shortString } from '../../common/schemas/short-string';
import { bool } from '../../common/schemas/positive-int';

export const CreateArtistSchema = object({
  name: shortString('Artist name'),
  grammy: bool(),
});
