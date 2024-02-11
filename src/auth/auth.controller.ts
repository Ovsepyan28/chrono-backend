import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from 'src/schemas/user.schema';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Авторизация')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Post('/login')
  @UsePipes(new ValidationPipe())
  login(@Body() loginDto: AuthDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 200 })
  @Post('/registration')
  @UsePipes(new ValidationPipe())
  registration(@Body() registrationDto: AuthDto) {
    return this.authService.registration(registrationDto);
  }
}
