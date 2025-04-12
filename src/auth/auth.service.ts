import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new UnauthorizedException('Email ya registrado');
    }

    const role = dto.role || Role.USER; 
    const user = await this.usersService.create(dto.email, dto.password, role);
    return this.getTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.getTokens(user.id, user.email, user.role);
  }

  async getTokens(userId: number, email: string, role: Role) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: 'ACCESS_SECRET',
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'REFRESH_SECRET',
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: 'REFRESH_SECRET',
      });

      const newAccessToken = this.jwtService.sign(
        { email: payload.email, sub: payload.sub, role: payload.role },
        {
          secret: 'ACCESS_SECRET',
          expiresIn: '15m',
        },
      );

      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
