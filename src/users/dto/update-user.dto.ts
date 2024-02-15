import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IUser } from '../users.interfaces';
import { ITask } from 'src/tasks/tasks.interfaces';
import {
  INCORRECT_PASSWORD_AUTH,
  REQUIRED_FIELD_AUTH,
} from 'src/auth/auth.constants';

export class UpdateUserDto {
  @ApiProperty({
    example: 'PH3u8Dt6M7QhnqRPJqw3',
    description: 'Пароль пользователя',
  })
  @IsNotEmpty({ message: REQUIRED_FIELD_AUTH })
  @IsString()
  @Length(6, 16, { message: INCORRECT_PASSWORD_AUTH })
  @IsOptional()
  password?: IUser['password'];

  @ApiProperty({
    example: 'Александр',
    description: 'Имя пользователя, которое видят другие пользователи',
    required: false,
  })
  @IsString()
  @IsOptional()
  displayName?: IUser['displayName'];

  @ApiProperty({
    example: [],
    description: 'Массив с id задач',
    required: false,
  })
  @IsArray()
  @IsOptional()
  tasks?: ITask['id'][];
}
