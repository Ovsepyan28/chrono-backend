import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Task {
  @ApiProperty({
    example: '65c7b307243c4d39a43531c8',
    description: 'Уникальный идентификатор задачи',
  })
  @Prop({ unique: true })
  id: string;

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
}

export const TaskSchema = SchemaFactory.createForClass(Task);
