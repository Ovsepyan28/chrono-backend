import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'PH3u8Dt6M7QhnqRPJqw3',
    description: 'Пароль пользователя',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Александр',
    description: 'Имя пользователя, которое видят другие пользователи',
    required: false,
  })
  @IsString()
  @IsOptional()
  displayName?: string;
}
