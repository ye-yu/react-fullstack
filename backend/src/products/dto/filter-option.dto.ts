import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterOptionDto {
  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  @IsOptional()
  categoryIds: number[] | null;

  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  @IsOptional()
  brandIds: number[] | null;

  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  @IsOptional()
  colorIds: number[] | null;

  @IsString()
  @IsOptional()
  name: string;
}
