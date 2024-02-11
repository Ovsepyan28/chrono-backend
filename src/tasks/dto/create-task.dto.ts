import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Крыша',
    description: 'Заголок задачи',
  })
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  @MaxLength(100, { message: 'Максимальная длина заголовка 100 символов' })
  title: string;

  @ApiProperty({
    example: 'Необходимо заменить покрытие крыши',
    description: 'Описание задачи',
  })
  @IsString()
  @IsNotEmpty({ message: 'Обязательное поле' })
  content: number;
}
