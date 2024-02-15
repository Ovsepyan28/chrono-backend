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
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from 'src/schemas/task.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role-auth.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { ITask } from './tasks.interfaces';
import { INCORRECT_ID_TASK, NOT_FOUND_TASK } from './tasks.constants';
import { INCORRECT_ID_USER } from 'src/users/users.constants';
import { Role as Roles } from 'src/users/users.interfaces';

@ApiTags('Задачи')
@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Получить все задачи' })
  @ApiResponse({ status: 200, type: [Task] })
  @Role(Roles.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  async getTasks(): Promise<ITask[]> {
    return this.tasksService.getTasks();
  }

  @ApiOperation({ summary: 'Создать задачу' })
  @ApiResponse({ status: 200, type: Task })
  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Headers('authorization') authorization: string,
  ): Promise<ITask> {
    return this.tasksService.createTask(createTaskDto, authorization);
  }

  @ApiOperation({ summary: 'Получить задачу по ID' })
  @ApiResponse({ status: 200, type: Task })
  @UseGuards(AuthGuard)
  @Get(':id')
  async getTaskById(
    @Param('id') id: ITask['id'],
    @Headers('authorization') authorization: string,
  ): Promise<ITask> {
    const isValid = mongoose.Types.ObjectId.isValid(String(id));
    if (!isValid) throw new BadRequestException(INCORRECT_ID_TASK);
    const foundTask = await this.tasksService.getTaskById(id, authorization);
    if (!foundTask) throw new NotFoundException(NOT_FOUND_TASK);

    return foundTask;
  }

  @ApiOperation({ summary: 'Удалить задачу' })
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTaskById(
    @Param('id') id: ITask['id'],
    @Headers('authorization') authorization: string,
  ): Promise<ITask> {
    const isValid = mongoose.Types.ObjectId.isValid(String(id));
    if (!isValid) throw new BadRequestException(INCORRECT_ID_USER);

    const deletedTask = await this.tasksService.deleteTaskById(
      id,
      authorization,
    );
    if (!deletedTask) throw new NotFoundException(NOT_FOUND_TASK);

    return deletedTask;
  }
}
