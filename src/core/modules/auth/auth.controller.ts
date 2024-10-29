import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { CreateUserDto, UpdateUserDto } from 'src/domain/dtos/user';
import { IsPublic } from './decorators';

@IsPublic()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() body: Omit<CreateUserDto, 'username' | 'name'>) {
    return this.authService.signIn(body);
  }
}
