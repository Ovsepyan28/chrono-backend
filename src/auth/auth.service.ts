import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: AuthDto) {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }

  async registration(registrationDto: AuthDto) {
    const user = await this.userService.createUser({
      ...registrationDto,
      password: registrationDto.password,
    });
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user['_id'],
      role: user.role,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(loginDto: AuthDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Некорректный email или пароль',
      });
    }

    const passwordEquals = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (passwordEquals) return user;

    throw new UnauthorizedException({
      message: 'Некорректный email или пароль',
    });
  }
}
