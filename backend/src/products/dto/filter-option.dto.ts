import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class FilterOptionDto {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsArray()
  @IsOptional()
  categoryIds: number[] | null;
}
