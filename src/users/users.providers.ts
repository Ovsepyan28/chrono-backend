import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { IUser, Role } from './users.interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersProvider {
  constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}

  async getUsers(): Promise<IUser[]> {
    return this.userModel.find().populate('tasks').exec();
  }

  async createUser(
    { email, displayName }: CreateUserDto,
    hashPassword: IUser['password'],
  ): Promise<IUser> {
    return new this.userModel({
      email: email,
      role: Role.USER,
      password: hashPassword,
      displayName: displayName || '',
    }).save();
  }

  async findUserByIdAndUpdate(
    id: IUser['id'],
    updateDto: UpdateUserDto,
  ): Promise<IUser> {
    return this.userModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  async deleteUserById(id: IUser['id']): Promise<IUser | null> {
    return this.userModel.findByIdAndDelete(id);
  }

  async getUserById(id: IUser['id']): Promise<IUser | null> {
    return this.userModel.findById(id).populate('tasks').exec();
  }

  async getUserByIdNotPopulate(id: IUser['id']): Promise<IUser | null> {
    return this.userModel.findById(id).exec();
  }

  async getUserByEmail(email: IUser['email']): Promise<IUser | null> {
    return this.userModel
      .findOne({
        email: email,
      })
      .exec();
  }
}
