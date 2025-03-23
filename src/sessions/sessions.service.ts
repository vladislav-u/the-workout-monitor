import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { WorkoutsService } from 'src/workouts/workouts.service';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    private readonly workoutsService: WorkoutsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    userId: number,
    workoutId: number,
    createSessionDto: CreateSessionDto,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const workout = await this.workoutsService.findById(workoutId);

    if (!workout) {
      throw new NotFoundException(`Workout with ID ${workoutId} not found`);
    }

    if (workout.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to create session',
      );
    }

    const session = this.sessionsRepository.create({
      ...createSessionDto,
      user,
      workout,
    });
    await this.sessionsRepository.save(session);

    return session;
  }

  async findAll(workoutId: number) {
    return await this.sessionsRepository.find({
      where: { workout: { id: workoutId } },
    });
  }

  async findById(id: number) {
    return await this.sessionsRepository.findOne({
      where: { id },
      relations: ['workout', 'user'],
    });
  }

  async update(
    userId: number,
    sessionId: number,
    updateSessionDto: UpdateSessionDto,
  ) {
    const session = await this.findById(sessionId);

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this session',
      );
    }

    Object.assign(session, updateSessionDto);
    return await this.sessionsRepository.save(session);
  }

  async remove(userId: number, id: number) {
    const session = await this.findById(id);

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    if (session.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this session',
      );
    }

    await this.sessionsRepository.delete(id);

    return { message: `Session with ID ${id} deleted` };
  }
}
