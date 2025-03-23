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
import { CreateSetDto } from './dto/create-set.dto';
import { UpdateSetDto } from './dto/update-set.dto';
import { SetsService } from './sets.service';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Post('session/:sessionId/exercise/:exerciseId')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createSetDto: CreateSetDto,
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
    @UserId() userId: number,
  ) {
    const set = await this.setsService.create(
      sessionId,
      exerciseId,
      userId,
      createSetDto,
    );
    return { message: 'Set created', set };
  }

  @Get('exercise/:exerciseId')
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Param('exerciseId', ParseIntPipe) exerciseId: number) {
    const sets = await this.setsService.findAll(exerciseId);
    return { message: 'Sets fetched', sets };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id', ParseIntPipe) id: number) {
    const set = await this.setsService.findById(id);
    return { message: 'Set fetched', set };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSetDto: UpdateSetDto,
    @UserId() userId: number,
  ) {
    const set = await this.setsService.update(userId, id, updateSetDto);
    return { message: 'Set updated', set };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ) {
    return await this.setsService.remove(userId, id);
  }
}
