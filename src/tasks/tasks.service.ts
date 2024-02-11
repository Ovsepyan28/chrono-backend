import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Task } from 'src/schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  getTasks() {
    return this.taskModel.find().exec();
  }

  async createTask(createTaskDto: CreateTaskDto, authorization: string) {
    const token = authorization.split(' ')[1];
    const user = await this.jwtService.verify(token);
    const newTask = new this.taskModel({
      ...createTaskDto,
      ownerId: user.id,
    });
    const updatedUser = await this.userModel.findById(user.id);
    updatedUser.tasks.push(newTask.id);
    await this.usersService.updateUser(user.id, updatedUser);
    return newTask.save();
  }

  getTaskById(id: string) {
    return this.taskModel.findById(id).populate('ownerId');
  }

  deleteTask(id: string) {
    return this.taskModel.findByIdAndDelete(id);
  }
}
