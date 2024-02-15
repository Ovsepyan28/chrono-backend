import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { ObjectId } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { User } from './user.schema';
import { ITask } from 'src/tasks/tasks.interfaces';
import { IUser } from 'src/users/users.interfaces';

@Schema()
export class Task implements ITask {
  @ApiProperty({
    example: '65c7b307243c4d39a43531c8',
    description: 'Уникальный идентификатор задачи',
  })
  @Transform(({ value }) => value.toString())
  id: ObjectId;

  @ApiProperty({
    example: 'Крыша',
    description: 'Заголок задачи',
  })
  @Prop()
  title: string;

  @ApiProperty({
    example: 'Необходимо заменить покрытие крыши',
    description: 'Описание задачи',
  })
  @Prop()
  content: string;

  @ApiProperty({
    example: '65c81b7271681ba810c9ad54',
    description: 'ID пользователя владельца задачи',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  ownerId: IUser['id'];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
