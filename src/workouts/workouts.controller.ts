import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/types/express-request.interface';
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
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user || !req.user?.userId) {
      throw new UnauthorizedException('User ID is missing from the request');
    }
    const userId: number = req.user.userId;

    const workout = await this.workoutsService.create(userId, createWorkoutDto);
    return { message: 'Workout created', workout };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req: AuthenticatedRequest) {
    if (!req.user || !req.user?.userId) {
      throw new UnauthorizedException('User ID is missing from request');
    }
    const userId: number = req.user.userId;

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
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user || !req.user?.userId) {
      throw new UnauthorizedException('User ID is missing from request');
    }
    const userId: number = req.user.userId;

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
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user || !req.user?.userId) {
      throw new UnauthorizedException('User ID is missing from request');
    }
    const userId: number = req.user.userId;

    return await this.workoutsService.remove(id, userId);
  }
}
