import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from 'src/auth/user.decorator';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post(':workoutId')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('workoutId', ParseIntPipe) workoutId: number,
    @Body() createExerciseDto: CreateExerciseDto,
    @UserId() userId: number,
  ) {
    const exercise = await this.exercisesService.create(
      userId,
      workoutId,
      createExerciseDto,
    );
    return { message: 'Exercise created', exercise };
  }

  @Get('workout/:workoutId')
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Param('workoutId', ParseIntPipe) workoutId: number) {
    const exercises = await this.exercisesService.findAll(workoutId);
    return { message: 'Exercises fetched', exercises };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id', ParseIntPipe) id: number) {
    const exercise = await this.exercisesService.findById(id);
    return { message: 'Exercise fetched', exercise };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @UserId() userId: number,
  ) {
    const exercise = await this.exercisesService.update(
      userId,
      id,
      updateExerciseDto,
    );
    return { message: 'Exercise updated', exercise };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ) {
    return await this.exercisesService.remove(userId, id);
  }
}
