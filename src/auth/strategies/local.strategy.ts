import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ passwordField: 'password' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Partial<CreateUserDTO>> {
    try {
      const user = await this.authService.validateUser(email, password);

      if (!user) {
        throw new UnauthorizedException('Неверные учетные данные пользователя');
      }

      return user;
    } catch (e) {
      console.log('error', e);
      throw e;
    }
  }
}
