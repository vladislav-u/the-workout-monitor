import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkoutExercise } from './workout-exercise.entity';

@Entity({ name: 'exercises' })
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => WorkoutExercise,
    (workoutExercise) => workoutExercise.exercise,
  )
  workoutExercises: WorkoutExercise[];

  @Column({ type: 'varchar', length: 255 })
  name: string;
}
