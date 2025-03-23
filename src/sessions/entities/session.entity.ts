import { Set } from 'src/sets/entities/set.entity';
import { User } from 'src/users/entities/user.entity';
import { Workout } from 'src/workouts/entities/workout.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'workout_sessions' })
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Set, (set) => set.session)
  sets: Set[];

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
