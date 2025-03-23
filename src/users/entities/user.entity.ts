import { Session } from 'src/sessions/entities/session.entity';
import { Workout } from 'src/workouts/entities/workout.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @OneToMany(() => Workout, (workout_template) => workout_template.user)
  workout_templates: Workout[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
