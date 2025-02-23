// src/auth/repositories/refresh-token.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from '../models/refresh-token.model';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken)
    private readonly refreshTokenModel: typeof RefreshToken,
  ) {}

  async create(refreshToken: Partial<RefreshToken>): Promise<RefreshToken> {
    return this.refreshTokenModel.create(refreshToken);
  }

  async findOne(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel.findOne({ where: { token } });
  }

  async delete(token: string): Promise<void> {
    await this.refreshTokenModel.destroy({ where: { token } });
  }

  async deleteForUser(userId: number): Promise<void> {
    await this.refreshTokenModel.destroy({ where: { userId } });
  }

  // Дополнительные методы (например, поиск по user id, удаление устаревших токенов и т.д.)
}
