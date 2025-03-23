import { Set } from 'src/sets/entities/set.entity';
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

  @OneToMany(() => Set, (set) => set.exercise)
  sets: Set[];

  @Column({ type: 'varchar', length: 255 })
  name: string;
}
