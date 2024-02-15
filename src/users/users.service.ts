import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersProvider } from './users.providers';
import { IUser } from './users.interfaces';
import {
  FORBIDDEN_AUTH,
  UNAUTHORIZED_USER_AUTH,
} from 'src/auth/auth.constants';
import { JwtService } from '@nestjs/jwt';
import { EMAIL_CONFLICT_USER, NOT_FOUND_USER } from './users.constants';
import { TasksProvider } from 'src/tasks/tasks.providers';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private usersProvider: UsersProvider,
    private jwtService: JwtService,
    private tasksProvider: TasksProvider,
  ) {}

  async getUsers(): Promise<IUser[]> {
    return this.usersProvider.getUsers();
  }

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const existingUser = await this.getUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(EMAIL_CONFLICT_USER);
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 5);

    const newUser = await this.usersProvider.createUser(
      createUserDto,
      hashPassword,
    );

    return newUser;
  }

  async getUserById(
    id: IUser['id'],
    authorization: string,
  ): Promise<IUser | null> {
    const [type, token] = authorization?.split(' ') ?? [];
    if (!token || type !== 'bearer') {
      throw new UnauthorizedException(UNAUTHORIZED_USER_AUTH);
    }

    const client = this.jwtService.verify<IUser>(token);
    if (client.role === 'user' && client.id !== id) {
      throw new ForbiddenException(FORBIDDEN_AUTH);
    }

    const user = await this.usersProvider.getUserById(id);
    return user;
  }

  async updateUserById(
    id: IUser['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    const targetUser = await this.getUserByIdNotPopulate(id);
    if (!targetUser) throw new NotFoundException(NOT_FOUND_USER);

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

  async updateTasks(id: IUser['id'], { tasks }: UpdateUserDto): Promise<IUser> {
    const targetUser = await this.getUserByIdNotPopulate(id);
    if (!targetUser) throw new NotFoundException(NOT_FOUND_USER);

    targetUser.tasks = tasks;

    return this.usersProvider.findUserByIdAndUpdate(id, targetUser);
  }

  async deleteUserById(id: IUser['id']): Promise<IUser | null> {
    const deletedUser = await this.usersProvider.deleteUserById(id);

    //Необходимо описать логику удаления всех задач, которые принадлежат пользователю

    return deletedUser;
  }

  async getUserByEmail(email: IUser['email']): Promise<IUser | null> {
    return this.usersProvider.getUserByEmail(email);
  }

  async getUserByIdNotPopulate(id: IUser['id']): Promise<IUser | null> {
    return this.usersProvider.getUserByIdNotPopulate(id);
  }
}
