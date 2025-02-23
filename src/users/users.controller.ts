import { UsersService } from './users.service';
import { Controller } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {} //конструктор принимает данные и методы
}
