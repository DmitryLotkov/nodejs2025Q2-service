import { pipe, number, integer, minValue, boolean } from 'valibot';

export const positiveInt = (label = 'Value') =>
  pipe(
    number(),
    integer(`${label} must be an integer`),
    minValue(0, `${label} must be ≥ 0`),
  );

export const bool = () => boolean();
