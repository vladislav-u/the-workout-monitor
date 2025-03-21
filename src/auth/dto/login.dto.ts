import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is empty' })
  @MinLength(6, { message: 'Minimum password lenth is 6' })
  password: string;
}
