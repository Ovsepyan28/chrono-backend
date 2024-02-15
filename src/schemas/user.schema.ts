import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { ObjectId } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { Task } from './task.schema';
import { IUser, Role } from 'src/users/users.interfaces';
import { ITask } from 'src/tasks/tasks.interfaces';

@Schema()
export class User implements IUser {
  @ApiProperty({
    example: '65c7b307243c4d39a43531c8',
    description: 'Уникальный идентификатор пользователя',
  })
  @Transform(({ value }) => value.toString())
  id: ObjectId;

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
  role: Role;

  @ApiProperty({
    example: [],
    description: 'Массив задач пользователя',
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  })
  @Type(() => Task)
  tasks: ITask['id'][];
}

export const UserSchema = SchemaFactory.createForClass(User);
