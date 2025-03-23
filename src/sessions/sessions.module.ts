import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Workout } from 'src/workouts/entities/workout.entity';
import { WorkoutsService } from 'src/workouts/workouts.service';
import { Session } from './entities/session.entity';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session, User, Workout])],
  controllers: [SessionsController],
  providers: [SessionsService, UsersService, WorkoutsService],
})
export class SessionsModule {}
