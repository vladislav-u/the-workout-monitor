import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import { ExercisesModule } from 'src/exercises/exercises.module';
import { ExercisesService } from 'src/exercises/exercises.service';
import { Session } from 'src/sessions/entities/session.entity';
import { SessionsService } from 'src/sessions/sessions.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { WorkoutsModule } from 'src/workouts/workouts.module';
import { WorkoutsService } from 'src/workouts/workouts.service';
import { SetsController } from './sets.controller';
import { SetsService } from './sets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Set, Session, Exercise]),
    WorkoutsModule,
    UsersModule,
    ExercisesModule,
  ],
  controllers: [SetsController],
  providers: [
    SetsService,
    SessionsService,
    ExercisesService,
    WorkoutsService,
    UsersService,
  ],
})
export class SetsModule {}
