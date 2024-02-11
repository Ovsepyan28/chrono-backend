import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Headers,
  HttpException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from 'src/schemas/task.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role-auth.decorator';
import { RoleGuard } from 'src/auth/role.guard';

@ApiTags('Задачи')
@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Получить все задачи' })
  @ApiResponse({ status: 200, type: [Task] })
  @Role('admin')
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getTasks() {
    return this.tasksService.getTasks();
  }

  @ApiOperation({ summary: 'Создать задачу' })
  @ApiResponse({ status: 200, type: Task })
  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Headers('authorization') authorization: string,
  ) {
    return this.tasksService.createTask(createTaskDto, authorization);
  }

  @ApiOperation({ summary: 'Получить задачу по ID' })
  @ApiResponse({ status: 200, type: Task })
  @UseGuards(AuthGuard)
  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Невалидный ID', 400);

    const findTask = await this.tasksService.getTaskById(id);
    if (!findTask) throw new HttpException('Задача не найдена', 404);

    return findTask;
  }

  @ApiOperation({ summary: 'Удалить задачу' })
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Невалидный ID', 400);

    return this.tasksService.deleteTask(id);
  }
}
