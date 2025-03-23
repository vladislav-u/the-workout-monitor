import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Workout } from 'src/workouts/entities/workout.entity';
import { WorkoutsModule } from 'src/workouts/workouts.module';
import { WorkoutsService } from 'src/workouts/workouts.service';
import { Exercise } from './entities/exercise.entity';
import { WorkoutExercise } from './entities/workout-exercise.entity';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout, Exercise, WorkoutExercise]),
    WorkoutsModule,
    UsersModule,
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService, WorkoutsService],
  exports: [ExercisesService, TypeOrmModule],
})
export class ExercisesModule {}
