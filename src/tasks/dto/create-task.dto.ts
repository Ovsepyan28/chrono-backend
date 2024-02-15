import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ITask } from '../tasks.interfaces';
import { MAX_TITLE_LENGTH_TASK } from '../tasks.constants';
import { REQUIRED_FIELD_AUTH } from 'src/auth/auth.constants';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Крыша',
    description: 'Заголок задачи',
  })
  @IsString()
  @IsNotEmpty({ message: REQUIRED_FIELD_AUTH })
  @MaxLength(100, { message: MAX_TITLE_LENGTH_TASK })
  title: ITask['title'];

  @ApiProperty({
    example: 'Необходимо заменить покрытие крыши',
    description: 'Описание задачи',
  })
  @IsString()
  @IsNotEmpty({ message: REQUIRED_FIELD_AUTH })
  content: ITask['content'];
}
