import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener tokens' })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { access_token, refresh_token } = await this.authService.login(dto);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ access_token });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  @ApiBearerAuth() 
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar el access token usando el refresh token' })
  async refresh(@Request() req: ExpressRequest, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    const newTokens = await this.authService.refreshToken(refreshToken);

    return res.json({ access_token: newTokens.access_token });
  }
}
