import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role-auth.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { IUser } from './users.interfaces';
import { INCORRECT_ID_USER, NOT_FOUND_USER } from './users.constants';
import { Role as Roles } from 'src/users/users.interfaces';

@ApiTags('Пользователи')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Получить всех пользователей',
  })
  @ApiResponse({ status: 200, type: [User] })
  @Role(Roles.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  async getUsers(): Promise<IUser[]> {
    return this.usersService.getUsers();
  }

  @ApiOperation({
    summary: 'Создать пользователя',
  })
  @ApiResponse({ status: 200, type: User })
  @Role(Roles.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({
    summary: 'Получить пользователя по ID',
  })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserByIdPopulate(
    @Param('id') id: IUser['id'],
    @Headers('authorization') authorization: string,
  ): Promise<IUser> {
    const isValid = mongoose.Types.ObjectId.isValid(String(id));
    if (!isValid) throw new BadRequestException(INCORRECT_ID_USER);

    const foundUser = await this.usersService.getUserById(id, authorization);
    if (!foundUser) throw new NotFoundException(NOT_FOUND_USER);

    return foundUser;
  }

  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(AuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: IUser['id'],
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(String(id));
    if (!isValid) throw new BadRequestException(INCORRECT_ID_USER);

    const updatedUser = await this.usersService.updateUserById(
      id,
      updateUserDto,
    );
    if (!updatedUser) throw new NotFoundException(NOT_FOUND_USER);

    return updatedUser;
  }

  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiResponse({ status: 200 })
  @Role(Roles.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  async deleteUserById(@Param('id') id: IUser['id']): Promise<void> {
    const isValid = mongoose.Types.ObjectId.isValid(String(id));
    if (!isValid) throw new BadRequestException(INCORRECT_ID_USER);

    const deletedUser = await this.usersService.deleteUserById(id);
    if (!deletedUser) throw new NotFoundException(NOT_FOUND_USER);

    return;
  }
}
