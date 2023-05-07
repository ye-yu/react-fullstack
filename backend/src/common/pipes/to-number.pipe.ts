import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { IsNumberOptions, isNumber } from 'class-validator';

export function ToNumber(
  ifEmpty?: number,
  numberOptions?: IsNumberOptions,
): PipeTransform<string, number> {
  return {
    transform: function (value: string, metadata: ArgumentMetadata): number {
      if (!value) return ifEmpty;
      const numbered = Number(value);

      if (isNaN(numbered)) {
        throw new BadRequestException(
          {
            message: `value of ${metadata.data} is not a number: ${value}`,
            field: metadata.data,
            value: value,
          },
          'NaN Error',
        );
      }

      if (!isNumber(numbered, numberOptions)) {
        throw new BadRequestException(
          {
            message: `value of ${metadata.data} is not a number: ${value}`,
            field: metadata.data,
            value: value,
          },
          'NaN Error',
        );
      }

      return numbered;
    },
  };
}
