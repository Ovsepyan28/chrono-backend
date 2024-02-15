import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITask } from './tasks.interfaces';
import { Task } from 'src/schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { IUser } from 'src/users/users.interfaces';

@Injectable()
export class TasksProvider {
  constructor(@InjectModel(Task.name) private taskModel: Model<ITask>) {}

  async getTasks(): Promise<ITask[]> {
    return this.taskModel.find().exec();
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    ownerId: IUser['id'],
  ): Promise<ITask> {
    return new this.taskModel({
      ...createTaskDto,
      ownerId: ownerId,
    }).save();
  }

  async getTaskById(id: ITask['id']): Promise<ITask | null> {
    return this.taskModel.findById(id);
  }

  async findTaskByIdAndDelete(id: IUser['id']): Promise<ITask> {
    return this.taskModel.findByIdAndDelete(id);
  }

  async updateTasks(tasks: ITask['id'][]): Promise<void> {
    await this.taskModel.updateMany(...tasks);
    return;
  }
}
