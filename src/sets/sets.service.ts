import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExercisesService } from 'src/exercises/exercises.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { Repository } from 'typeorm';
import { CreateSetDto } from './dto/create-set.dto';
import { UpdateSetDto } from './dto/update-set.dto';
import { Set } from './entities/set.entity';

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(Set) private readonly setsRepository: Repository<Set>,
    private readonly sessionsService: SessionsService,
    private readonly exercisesService: ExercisesService,
  ) {}

  async create(
    sessionId: number,
    exerciseId: number,
    userId: number,
    createSetDto: CreateSetDto,
  ) {
    const session = await this.sessionsService.findById(sessionId);

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    const exercise = await this.exercisesService.findById(exerciseId);

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
    }

    if (session.user.id !== userId) {
      throw new ForbiddenException(
        'You have no permission to add a set to this session',
      );
    }

    const set = this.setsRepository.create({
      ...createSetDto,
      session,
      exercise,
    });
    await this.setsRepository.save(set);

    return set;
  }

  async findAll(exerciseId: number) {
    return await this.setsRepository.find({
      where: { exercise: { id: exerciseId } },
    });
  }

  async findById(id: number) {
    return await this.setsRepository.findOne({
      where: { id },
      relations: ['session', 'session.user'],
    });
  }

  async update(userId: number, setId: number, updateSetDto: UpdateSetDto) {
    const set = await this.findById(setId);

    if (!set) {
      throw new NotFoundException(`Set with ID ${setId} not found`);
    }

    if (set.session.user.id !== userId) {
      throw new ForbiddenException('You have no permission to update this set');
    }

    Object.assign(set, updateSetDto);
    return await this.setsRepository.save(set);
  }

  async remove(userId: number, setId: number) {
    const set = await this.findById(setId);

    if (!set) {
      throw new NotFoundException(`Set with ID ${setId} not found`);
    }

    if (set.session.user.id !== userId) {
      throw new ForbiddenException('You have no permission to delete this set');
    }

    await this.setsRepository.delete(setId);

    return { message: `Set with ID ${setId} deleted` };
  }
}
