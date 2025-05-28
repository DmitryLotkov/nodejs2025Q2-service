import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { BaseSchema, safeParse } from 'valibot';
import { formatValibotPath } from '../utils/formatValibotPath';

@Injectable()
export class ValibotPipe<T = any> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: BaseSchema<T, any, any>) {}

  transform(value: unknown): T {
    const result = safeParse(this.schema, value);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        issues: result.issues.map((issue) => ({
          path: formatValibotPath(issue.path),
          message: issue.message,
        })),
      });
    }

    return result.output;
  }
}
