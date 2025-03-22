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
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createWorkoutDto: CreateWorkoutDto,
    @UserId() userId: number,
  ) {
    const workout = await this.workoutsService.create(userId, createWorkoutDto);
    return { message: 'Workout created', workout };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@UserId() userId: number) {
    const workouts = await this.workoutsService.findAll(userId);

    return { message: 'Workouts fetched', workouts };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id', ParseIntPipe) id: number) {
    const workout = await this.workoutsService.findById(id);
    return { message: 'Workout fetched', workout };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
    @UserId() userId: number,
  ) {
    const workout = await this.workoutsService.update(
      id,
      userId,
      updateWorkoutDto,
    );

    return { message: 'Workout updated', workout };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ) {
    return await this.workoutsService.remove(id, userId);
  }
}
