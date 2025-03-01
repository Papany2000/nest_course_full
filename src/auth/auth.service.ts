import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // Импортируйте ConfigService
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import * as crypto from 'crypto'; // Для генерации случайных токенов

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository, // Внедряем репозиторий RefreshToken
    private readonly configService: ConfigService, // Инъектируйте ConfigService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByLoginWithPassword(email);
    if (!user) {
      return null;
    }
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
  }

  async login(
    user: CreateUserDTO,
  ): Promise<{ accessToken: any; refreshToken: any; newUser: any }> {
    const newUser = await this.validateUser(user.email, user.password);
    if (!newUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.generateAccessToken(newUser);
    const refreshToken = await this.generateRefreshToken(newUser);
    return { accessToken, refreshToken, newUser };
  }

  async logout(refreshToken) {
    // Удаляем запись из БД
    await this.refreshTokenRepository.delete(refreshToken);
  }

  public async create(
    user: CreateUserDTO,
  ): Promise<{ newUser: any; accessToken: string; refreshToken: string }> {
    const pass = await this.hashPassword(user.password);

    const newUser = await this.usersService.CreateUser({
      ...user,
      password: pass,
    });

    const accessToken = await this.generateAccessToken({
      id: newUser.id,
      email: newUser.email,
    });
    const refreshToken = await this.generateRefreshToken({
      id: newUser.id,
      email: newUser.email,
    });
    return { newUser, accessToken, refreshToken };
  }

  public async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    const refreshTokenEntity =
      await this.refreshTokenRepository.findOne(refreshToken);

    if (!refreshTokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshTokenEntity.expiresAt < new Date()) {
      // Token has expired - remove it from database
      await this.refreshTokenRepository.delete(refreshToken);
      throw new UnauthorizedException('Refresh token expired');
    }

    // Get user from refresh token
    const user = await this.usersService.findOneById(refreshTokenEntity.id); // Нужно получить user

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Remove used refresh token
    await this.refreshTokenRepository.delete(refreshToken);

    // Generate a new access token
    const accessToken = await this.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    // Optionally generate a new refresh token
    const newRefreshToken = await this.generateRefreshToken(user);

    return { accessToken, refreshToken: newRefreshToken };
  }

  private async generateAccessToken(user: any): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    const secret = this.configService.get<string>('JWT_SECRET'); // secret получаем из конфига
    if (!secret) {
      console.error('JWT_SECRET is not defined!');
    }
    return this.jwtService.sign(payload, { secret }); //токен создаётся методом sign
  }

  private async generateRefreshToken(user: any): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex'); // Генерация случайного токена
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Срок действия 7 дней

    const refreshTokenEntity = {
      token: token,
      expiresAt: expiresAt,
      userId: user.id,
    };
    await this.refreshTokenRepository.create(refreshTokenEntity); //токен создаётся методом create и сохраняется в бд
    return token;
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    return bcrypt.compare(enteredPassword, dbPassword);
  }
}
