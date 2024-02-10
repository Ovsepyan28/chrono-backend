import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
