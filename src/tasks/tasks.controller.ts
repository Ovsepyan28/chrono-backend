import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Task } from 'src/schemas/task.schema';

@ApiTags('Задачи')
@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Получить все задачи' })
  @ApiResponse({ status: 200, type: [Task] })
  @Get()
  getTasks() {
    return this.tasksService.getTasks();
  }

  @ApiOperation({ summary: 'Создать задачу' })
  @ApiResponse({ status: 200, type: Task })
  @Post()
  @UsePipes(new ValidationPipe())
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @ApiOperation({ summary: 'Удалить задачу' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
