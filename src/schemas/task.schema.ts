import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  start: number;

  @Prop({ required: true })
  end: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
