import { ObjectId } from 'mongoose';
import { IUser } from 'src/users/users.interfaces';

export interface ITask {
  id: ObjectId;
  title: string;
  content: string;
  ownerId: IUser['id'];
}
