import { Body, Controller, Get, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { CreateUserDto, UpdateUserDto } from 'src/domain/dtos/user';
import { IsPublic } from './decorators';

@IsPublic()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('sign-in')
  signIn(@Body() body: UpdateUserDto) {
    return this.authService.signIn(body);
  }

  @Post('sign-up')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }
}
