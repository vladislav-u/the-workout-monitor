import { WorkoutExercise } from 'src/exercises/entities/workout-exercise.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'workout_templates' })
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.workout_templates, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(
    () => WorkoutExercise,
    (workoutExercise) => workoutExercise.workout,
  )
  workoutExercises: WorkoutExercise[];

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
