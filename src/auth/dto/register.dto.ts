import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../users/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
