import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getUsers() {
    return this.userModel.find().exec();
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.getUserByEmail(createUserDto.email);
    if (existingUser)
      throw new HttpException('Пользователь с таким email уже существует', 400);

    const hashPassword = await bcrypt.hash(createUserDto.password, 5);
    const newUser = new this.userModel({
      ...createUserDto,
      role: 'user',
      password: hashPassword,
      displayName: createUserDto.displayName || '',
    });
    return newUser.save();
  }

  getUserById(id: string) {
    return this.userModel.findById(id).populate('tasks');
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const targetUser = await this.userModel.findById(id);
    if (!targetUser) throw new HttpException('Пользователь не найден', 404);

    if (updateUserDto.password) {
      targetUser.password = await bcrypt.hash(updateUserDto.password, 5);
    }

    if (updateUserDto.displayName !== undefined) {
      targetUser.displayName = updateUserDto.displayName;
    }

    if (updateUserDto.tasks.length !== targetUser.tasks.length) {
      targetUser.tasks = updateUserDto.tasks;
    }

    return this.userModel.findByIdAndUpdate(id, targetUser, { new: true });
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  getUserByEmail(email: string) {
    return this.userModel
      .findOne({
        email: email,
      })
      .exec();
  }
}
