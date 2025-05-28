import {pipe, string, uuid} from "valibot";

export const uuidString = (label = 'ID') =>
    pipe(
        string(),
        uuid(`${label} must be valid UUID v4`)
    );