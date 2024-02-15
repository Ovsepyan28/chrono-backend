import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { INCORRECT_AUTH } from './auth.constants';
import { IUser } from 'src/users/users.interfaces';
import { AuthRequest, PayloadForToken } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: AuthDto): Promise<AuthRequest> {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }

  async registration({ email, password }: AuthDto): Promise<AuthRequest> {
    const user = await this.userService.createUser({
      email: email,
      password: password,
    });
    return this.generateToken(user);
  }

  private async generateToken({
    email,
    id,
    role,
  }: IUser): Promise<AuthRequest> {
    const payload: PayloadForToken = {
      email: email,
      id: id,
      role: role,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser({ email, password }: AuthDto): Promise<IUser> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(INCORRECT_AUTH);
    }

    const passwordEquals = await bcrypt.compare(password, user.password);

    if (passwordEquals) return user;

    throw new UnauthorizedException(INCORRECT_AUTH);
  }
}
