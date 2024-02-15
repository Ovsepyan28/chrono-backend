import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Task } from 'src/schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ITask } from './tasks.interfaces';
import { IUser } from 'src/users/users.interfaces';
import { TasksProvider } from './tasks.providers';
import {
  FORBIDDEN_AUTH,
  UNAUTHORIZED_USER_AUTH,
} from 'src/auth/auth.constants';
import { UsersProvider } from 'src/users/users.providers';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
    private tasksProvider: TasksProvider,
    private usersProvider: UsersProvider,
  ) {}

  async getTasks(): Promise<ITask[]> {
    return this.tasksProvider.getTasks();
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    authorization: string,
  ): Promise<ITask> {
    const [type, token] = authorization?.split(' ') ?? [];
    if (!token || type !== 'bearer') {
      throw new UnauthorizedException(UNAUTHORIZED_USER_AUTH);
    }

    const user = this.jwtService.verify<IUser>(token);
    const newTask = await this.tasksProvider.createTask(createTaskDto, user.id);

    const updatedUser = await this.usersProvider.getUserByIdNotPopulate(
      user.id,
    );
    updatedUser.tasks.push(newTask.id);

    await this.usersService.updateTasks(user.id, updatedUser);
    return newTask;
  }

  async getTaskById(
    id: ITask['id'],
    authorization: string,
  ): Promise<ITask | null> {
    const [type, token] = authorization?.split(' ') ?? [];
    if (!token || type !== 'bearer') {
      throw new UnauthorizedException(UNAUTHORIZED_USER_AUTH);
    }
    const client = this.jwtService.verify<IUser>(token);
    const task = await this.tasksProvider.getTaskById(id);

    if (client.role === 'user' && String(client.id) !== String(task.ownerId)) {
      throw new ForbiddenException(FORBIDDEN_AUTH);
    }

    return task;
  }

  async deleteTaskById(
    id: ITask['id'],
    authorization: string,
  ): Promise<ITask | null> {
    const [type, token] = authorization?.split(' ') ?? [];
    if (!token || type !== 'bearer') {
      throw new UnauthorizedException(UNAUTHORIZED_USER_AUTH);
    }

    const client = this.jwtService.verify<IUser>(token);
    if (client.role === 'user' && client.id !== id) {
      throw new ForbiddenException(FORBIDDEN_AUTH);
    }

    const deletedTask = await this.tasksProvider.findTaskByIdAndDelete(id);

    const updatedUser = await this.usersProvider.getUserByIdNotPopulate(
      client.id,
    );
    updatedUser.tasks = updatedUser.tasks.filter((task) => {
      return task != id;
    });

    await this.usersService.updateTasks(client.id, updatedUser);

    return deletedTask;
  }
}
