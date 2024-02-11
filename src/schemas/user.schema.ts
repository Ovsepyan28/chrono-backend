import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Task } from './task.schema';

@Schema()
export class User {
  @ApiProperty({
    example: '65c7b307243c4d39a43531c8',
    description: 'Уникальный идентификатор пользователя',
  })
  @Prop({ unique: true })
  id: string;

  @ApiProperty({
    example: 'ivanov@gmail.com',
    description: 'Уникальный aдрес электронной почты пользователя',
  })
  @Prop({ unique: true })
  email: string;

  @ApiProperty({
    example: 'PH3u8Dt6M7QhnqRPJqw3',
    description: 'Пароль пользователя',
  })
  @Prop()
  password: string;

  @ApiProperty({
    example: 'Александр',
    description: 'Имя пользователя, которое видят другие пользователи',
  })
  @Prop()
  displayName: string;

  @ApiProperty({
    example: 'user',
    description: 'Роль пользователя user|admin',
  })
  @Prop()
  role: string;

  @ApiProperty({
    example: [],
    description: 'Массив задач пользователя',
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  })
  tasks: Task[];
}

export const UserSchema = SchemaFactory.createForClass(User);
