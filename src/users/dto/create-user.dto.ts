import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { HasMany } from 'sequelize-typescript';
import { RefreshToken } from 'src/auth/models/refresh-token.model';
export class CreateUserDTO {
  @ApiProperty({ example: 'papany@rambler.ru', description: 'email' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'vbnmn', description: 'пароль' })
  @IsString()
  password: string;

  @HasMany(() => RefreshToken)
  refreshTokens: RefreshToken[]; // Связь один-ко-многим с RefreshToken
}
