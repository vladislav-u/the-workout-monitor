import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/types/jwt-payload.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateToken(userId: number, secret: string, expiresIn: string) {
    return this.jwtService.sign({ userId }, { secret, expiresIn });
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
    // Create user in DB
    const user = await this.usersService.create(createUserDto);

    const jwtAccessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    if (!jwtAccessSecret) {
      throw new Error('Missing JWT_ACCESS_SECRET in environment variables');
    }

    const jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!jwtRefreshSecret) {
      throw new Error('Missing JWT_REFRESH_SECRET in environment variables');
    }

    // Generate JWT refresh_token
    const refresh_token = this.generateToken(user.id, jwtRefreshSecret, '3d');

    // Generate JWT access_token
    const access_token = this.generateToken(user.id, jwtAccessSecret, '15m');

    return { ...user, access_token, refresh_token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtAccessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    if (!jwtAccessSecret) {
      throw new Error('Missing JWT_ACCESS_SECRET in environment variables');
    }
    const jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!jwtRefreshSecret) {
      throw new Error('Missing JWT_REFRESH_SECRET in environment variables');
    }

    // Generate JWT refresh_token
    const refresh_token = this.generateToken(user.id, jwtRefreshSecret, '3d');

    // Generate JWT access_token
    const access_token = this.generateToken(user.id, jwtAccessSecret, '15m');

    return { ...user, access_token, refresh_token };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const jwtAccessSecret =
        this.configService.get<string>('JWT_ACCESS_SECRET');
      if (!jwtAccessSecret) {
        throw new Error('Missing JWT_ACCESS_SECRET in environment variables');
      }

      const jwtRefreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET');
      if (!jwtRefreshSecret) {
        throw new Error('Missing JWT_REFRESH_SECRET in environment variables');
      }

      const decoded = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: jwtRefreshSecret,
      });

      const user = await this.usersService.findById(decoded.userId);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.generateToken(
        user.id,
        jwtAccessSecret,
        '15m',
      );
      const newRefreshToken = this.generateToken(
        user.id,
        jwtRefreshSecret,
        '3d',
      );

      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
