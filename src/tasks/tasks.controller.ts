import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks() {
    return this.tasksService.getAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }
}
