import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkoutsService } from 'src/workouts/workouts.service';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';
import { WorkoutExercise } from './entities/workout-exercise.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exercisesRepository: Repository<Exercise>,
    @InjectRepository(WorkoutExercise)
    private readonly workoutExerciseRepository: Repository<WorkoutExercise>,
    private readonly workoutsService: WorkoutsService,
  ) {}

  async create(
    userId: number,
    workoutId: number,
    createExerciseDto: CreateExerciseDto,
  ) {
    const workout = await this.workoutsService.findById(workoutId);
    if (!workout) {
      throw new NotFoundException(`Workout with ID ${workoutId} not found`);
    }

    if (workout.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to create exercise',
      );
    }

    const exercise = this.exercisesRepository.create(createExerciseDto);
    await this.exercisesRepository.save(exercise);

    const workoutExercise = this.workoutExerciseRepository.create({
      workout,
      exercise,
      position: 1,
    });
    await this.workoutExerciseRepository.save(workoutExercise);

    return exercise;
  }

  async findAll(workoutId: number) {
    return await this.workoutExerciseRepository.find({
      where: { workout: { id: workoutId } },
      relations: ['exercise'],
    });
  }

  async findById(id: number) {
    return await this.exercisesRepository.findOne({ where: { id } });
  }

  async update(
    userId: number,
    exerciseId: number,
    updateExerciseDto: UpdateExerciseDto,
  ) {
    const workoutExercise = await this.workoutExerciseRepository.findOne({
      where: { exercise: { id: exerciseId } },
      relations: ['workout', 'workout.user'],
    });

    if (!workoutExercise) {
      throw new NotFoundException(
        `Exercise with ID ${exerciseId} does not have a junction table`,
      );
    }

    if (workoutExercise.workout.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this exercise',
      );
    }

    const exercise = await this.findById(exerciseId);

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
    }

    Object.assign(exercise, updateExerciseDto);
    return await this.exercisesRepository.save(exercise);
  }

  async remove(userId: number, exerciseId: number) {
    const workoutExercise = await this.workoutExerciseRepository.findOne({
      where: { exercise: { id: exerciseId } },
      relations: ['workout', 'workout.user'],
    });

    if (!workoutExercise) {
      throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
    }

    if (workoutExercise.workout.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this exercise',
      );
    }

    const exercise = await this.findById(exerciseId);

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
    }

    await this.exercisesRepository.delete(exerciseId);

    return { message: `Exercise with ID ${exerciseId} deleted` };
  }
}
