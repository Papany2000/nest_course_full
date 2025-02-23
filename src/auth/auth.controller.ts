import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация и аутотентификация пользователя' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ status: 201, description: 'User успешно создан' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('signin')
  async signin(@Body() user: CreateUserDTO) {
    return this.authService.create(user);
  }

  @ApiBody({ type: CreateUserDTO })
  @HttpCode(HttpStatus.OK) // Устанавливаем код ответа 200 OK
  @ApiOperation({
    summary: 'Обновите токен доступа с помощью токена обновления',
  }) // Описание эндпоинта
  @ApiOkResponse({
    description: 'Токен доступа успешно обновлен',
    type: RefreshTokenDto, // Описываем структуру успешного ответа (accessToken и refreshToken)
  })
  @ApiBadRequestResponse({
    description: 'Invalid refresh token',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: Refresh token is invalid or expired',
  })
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken); // Обновляем access token
  }

  @ApiOperation({ summary: 'Аутотентификация пользователя' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ status: 200, description: 'Успешо' })
  @ApiResponse({ status: 401, description: 'Описание ошибки' })
  @Post('login')
  async login(@Body() user) {
    return this.authService.login(user); // Вернет { accessToken, refreshToken }
  }

  @ApiOperation({
    summary: 'Выход из системы',
    description: 'Удаляет refresh token пользователя',
  })
  @ApiNoContentResponse({ description: 'Токен успешно удален (204)' })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @ApiUnauthorizedResponse({ description: 'Недействительный токен' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Body() logoutDto: RefreshTokenDto): Promise<void> {
    try {
      await this.authService.logout(logoutDto.refreshToken);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
