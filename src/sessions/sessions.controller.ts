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
  create(
    @Param('workoutId', ParseIntPipe) workoutId: number,
    @Body() createSessionDto: CreateSessionDto,
    @UserId() userId: number,
  ) {
    return this.sessionsService.create(userId, workoutId, createSessionDto);
  }

  @Get('workout/:workoutId')
  @UseGuards(AuthGuard('jwt'))
  findAll(@Param('workoutId', ParseIntPipe) workoutId: number) {
    return this.sessionsService.findAll(workoutId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
    @UserId() userId: number,
  ) {
    return this.sessionsService.update(userId, id, updateSessionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
    return this.sessionsService.remove(userId, id);
  }
}
