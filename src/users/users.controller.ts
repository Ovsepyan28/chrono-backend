import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';

@ApiTags('Пользователи')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({ status: 200, type: User })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);

    const findUser = await this.usersService.getUserById(id);
    if (!findUser) throw new HttpException('User not found', 404);

    return findUser;
  }

  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    if (!updatedUser) throw new HttpException('User not found', 404);

    //Если передали email
    if ('email' in updateUserDto) {
      throw new HttpException('You can not change email', 404);
    }

    return updatedUser;
  }

  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    const deletedUser = await this.usersService.deleteUser(id);
    if (!deletedUser) throw new HttpException('User not found', 404);

    return;
  }
}
