import { Workout } from 'src/workouts/entities/workout.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exercise } from './exercise.entity';

@Entity({ name: 'workout_template_exercises' })
export class WorkoutExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workout, (workout) => workout.workoutExercises, {
    onDelete: 'CASCADE',
  })
  workout: Workout;

  @ManyToOne(() => Exercise, (exercise) => exercise.workoutExercises, {
    onDelete: 'CASCADE',
  })
  exercise: Exercise;

  @Column({ type: 'int', nullable: false, default: 1 })
  position: number;
}
