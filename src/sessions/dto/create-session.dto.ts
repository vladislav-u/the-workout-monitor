import { IsISO8601, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsISO8601()
  startedAt: string;

  @IsOptional()
  @IsISO8601()
  finishedAt?: string;
}
