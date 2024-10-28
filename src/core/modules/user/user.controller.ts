import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findUser(@Req() request: Request) {
    const userId = request['user']['id'];
    return this.userService.findById(userId);
  }
}
