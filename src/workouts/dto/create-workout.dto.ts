import { IsNotEmpty } from 'class-validator';

export class CreateWorkoutDto {
  @IsNotEmpty({ message: 'Workout name is empty' })
  name: string;
}
