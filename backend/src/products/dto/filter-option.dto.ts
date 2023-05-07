import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterOptionDto {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsArray()
  @IsOptional()
  categoryIds: number[] | null;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsArray()
  @IsOptional()
  brandIds: number[] | null;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsArray()
  @IsOptional()
  colorIds: number[] | null;

  @IsString()
  @IsOptional()
  name: string;
}
