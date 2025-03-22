import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Workout } from './entities/workout.entity';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutsRepository: Repository<Workout>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, createWorkoutDto: CreateWorkoutDto) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const workout = this.workoutsRepository.create({
      ...createWorkoutDto,
      user,
    });

    return await this.workoutsRepository.save(workout);
  }

  async findAll(userId: number) {
    return await this.workoutsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findById(id: number) {
    return await this.workoutsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: number, userId: number, updateWorkoutDto: UpdateWorkoutDto) {
    const workout = await this.findById(id);

    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`);
    }

    if (workout.user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this workout',
      );
    }

    Object.assign(workout, updateWorkoutDto);
    return await this.workoutsRepository.save(workout);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const workout = await this.findById(id);

    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`);
    }

    if (workout.user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this workout',
      );
    }

    await this.workoutsRepository.delete(id);

    return { message: `Workout with ID ${id} has been deleted successfully.` };
  }
}
