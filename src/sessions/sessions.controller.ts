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
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post(':workoutId')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('workoutId', ParseIntPipe) workoutId: number,
    @Body() createSessionDto: CreateSessionDto,
    @UserId() userId: number,
  ) {
    const session = await this.sessionsService.create(
      userId,
      workoutId,
      createSessionDto,
    );
    return { message: 'Session created', session };
  }

  @Get('workout/:workoutId')
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Param('workoutId', ParseIntPipe) workoutId: number) {
    const sessions = await this.sessionsService.findAll(workoutId);
    return { message: 'Sessions fetched', sessions };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id', ParseIntPipe) id: number) {
    const session = await this.sessionsService.findById(id);
    return { message: 'Session fetched', session };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
    @UserId() userId: number,
  ) {
    const session = await this.sessionsService.update(
      userId,
      id,
      updateSessionDto,
    );
    return { message: 'Session updated', session };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ) {
    return await this.sessionsService.remove(userId, id);
  }
}
