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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @ApiOperation({ summary: 'Удалить задачу' })
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
