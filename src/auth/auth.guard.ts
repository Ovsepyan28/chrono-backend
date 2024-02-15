import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { IUser } from 'src/users/users.interfaces';
import { UNAUTHORIZED_USER_AUTH } from './auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(UNAUTHORIZED_USER_AUTH);
    }

    try {
      const user = this.jwtService.verify<IUser>(token);
      request.user = user;
    } catch (e) {
      throw new UnauthorizedException(UNAUTHORIZED_USER_AUTH);
    }
    return true;
  }

  extractTokenFromHeader(request: {
    headers: { authorization: string };
  }): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'bearer' ? token : undefined;
  }
}
