import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'PH3u8Dt6M7QhnqRPJqw3',
    description: 'Пароль пользователя',
  })
  @IsNotEmpty({ message: 'Обязательное поле' })
  @IsString()
  @Length(6, 16, { message: 'Длина пароля от 6 до 16 символов' })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'Александр',
    description: 'Имя пользователя, которое видят другие пользователи',
    required: false,
  })
  @IsString()
  @IsOptional()
  displayName?: string;
}
