import { InjectModel } from '@nestjs/sequelize';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async CreateUser(dto: CreateUserDTO) {
    // Сначала проверяем, существует ли пользователь с таким email
    const existingUser = await this.findOneByLogin(dto.email);
    if (existingUser) {
      // email уже занят, выбрасываем исключение
      throw new ConflictException('email уже занят');
    }

    // Если email свободен, создаем нового пользователя
    const user = await this.userRepository.create({ ...dto });
    return user;
  }

  async findOneByLogin(email: string): Promise<User | null> {
    return this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne<User>({ where: { id } });
  }

  // функция вызывается при создании пользователя в auth.service.ts
  async findOneByLoginWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findOne<User>({
      where: { email },
    });
  }
}
