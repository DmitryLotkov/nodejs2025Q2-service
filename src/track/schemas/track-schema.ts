import { object } from 'valibot';
import {shortString} from "../../common/schemas/short-string";
import {positiveInt} from "../../common/schemas/positive-int";
import {uuidString} from "../../common/schemas/uuid-string";

export const CreateTrackSchema = object({
    name: shortString('Track name'),
    duration: positiveInt('Duration (sec)'),
    artistId: uuidString('Artist ID'),
    albumId: uuidString('Album ID'),
});