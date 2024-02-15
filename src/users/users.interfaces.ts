import { ObjectId } from 'mongoose';
import { ITask } from 'src/tasks/tasks.interfaces';

export interface IUser {
  id: ObjectId;
  email: string;
  password: string;
  displayName?: string;
  role: Role;
  tasks: ITask['id'][];
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
