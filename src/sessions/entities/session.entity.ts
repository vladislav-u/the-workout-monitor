import { User } from 'src/users/entities/user.entity';
import { Workout } from 'src/workouts/entities/workout.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'workout_sessions' })
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Workout, (workout) => workout.sessions, {
    onDelete: 'SET NULL',
  })
  workout: Workout;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date | null;
}
