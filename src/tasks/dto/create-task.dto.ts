import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Крыша',
    description: 'Заголок задачи',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Необходимо заменить покрытие крыши',
    description: 'Описание задачи',
  })
  @IsString()
  @IsNotEmpty()
  content: number;
}
