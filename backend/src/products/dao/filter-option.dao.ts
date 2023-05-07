import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class FilterOptionDao {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsArray()
  @IsOptional()
  categoryIds: number[] | null;
}
