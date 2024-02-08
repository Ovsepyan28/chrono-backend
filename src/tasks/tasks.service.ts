import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  getAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);

    return createdTask.save();
  }

  delete(id: string): Promise<Task> {
    const deletedTask = this.taskModel.findByIdAndDelete(id);

    return deletedTask;
  }
}
