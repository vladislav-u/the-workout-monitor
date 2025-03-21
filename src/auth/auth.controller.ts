import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(ValidationPipe)
    createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.authService.register(createUserDto);

    if (!user) {
      throw new BadRequestException('User registration failed');
    }

    this.setAuthCookies(res, user.access_token, user.refresh_token);

    return res.json({ message: 'User registered', user });
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new BadRequestException('User login failed');
    }

    this.setAuthCookies(res, user.access_token, user.refresh_token);

    return res.json({
      message: 'Login successfull',
      access_token: user.access_token,
    });
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = (req.cookies['refresh_token'] as string) || null;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const newTokens = await this.authService.refreshToken(refreshToken);

      this.setAuthCookies(res, newTokens.access_token, newTokens.refresh_token);

      return res.json({
        message: 'Token refreshed',
        access_token: newTokens.access_token,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private setAuthCookies(
    res: Response,
    access_token: string,
    refresh_token: string,
  ) {
    // Set access_token JWT in HTTP-only cookie
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    // Set refresh_token JWT in HTTP-only cookie
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
  }
}
