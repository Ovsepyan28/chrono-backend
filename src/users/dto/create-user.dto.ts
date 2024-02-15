import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IUser } from '../users.interfaces';
import {
  INCORRECT_EMAIL_AUTH,
  REQUIRED_FIELD_AUTH,
  INCORRECT_PASSWORD_AUTH,
} from 'src/auth/auth.constants';

export class CreateUserDto {
  @ApiProperty({
    example: 'ivanov@gmail.com',
    description: 'Уникальный aдрес электронной почты пользователя',
  })
  @IsNotEmpty({ message: REQUIRED_FIELD_AUTH })
  @IsString()
  @IsEmail({}, { message: INCORRECT_EMAIL_AUTH })
  email: IUser['email'];

  @ApiProperty({
    example: 'PH3u8Dt6M7QhnqRPJqw3',
    description: 'Пароль пользователя',
  })
  @IsNotEmpty({ message: REQUIRED_FIELD_AUTH })
  @IsString()
  @Length(6, 16, { message: INCORRECT_PASSWORD_AUTH })
  password: IUser['password'];

  @ApiProperty({
    example: 'Александр',
    description: 'Имя пользователя, которое видят другие пользователи',
    required: false,
  })
  @IsString()
  @IsOptional()
  displayName?: IUser['displayName'];
}
