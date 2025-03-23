import { Exercise } from 'src/exercises/entities/exercise.entity';
import { Session } from 'src/sessions/entities/session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'workout_sets' })
export class Set {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Session, (session) => session.sets, { onDelete: 'CASCADE' })
  session: Session;

  @ManyToOne(() => Exercise, (exercise) => exercise.sets, {
    onDelete: 'CASCADE',
  })
  exercise: Exercise;

  @Column({ type: 'int', nullable: false })
  setNumber: number;

  @Column({ type: 'int', nullable: false })
  reps: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  recordedAt: Date;
}
