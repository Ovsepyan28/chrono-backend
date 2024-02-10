import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Task } from './task.schema';

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop({ required: false })
  displayName?: string;

  @Prop({ required: false })
  avatarUrl?: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  })
  tasks: Task[];
}

export const UserSchema = SchemaFactory.createForClass(User);
