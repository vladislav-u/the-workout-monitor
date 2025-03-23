import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateSetDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  setNumber: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  reps: number;

  @IsOptional()
  @IsPositive()
  weight?: number;
}
