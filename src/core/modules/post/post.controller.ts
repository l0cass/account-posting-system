import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';

import { CreatePostDto, UpdatePostDto } from 'src/domain/dtos/post';

import { Role } from 'src/common/enums/role';
import { Roles } from '../user/decorators';
import { RoleGuard } from '../user/guards';

@Roles(Role.User)
@UseGuards(RoleGuard)
@Controller('post')
export class PostController {
  constructor(private readonly challengeService: PostService) {}

  @Get()
  getPosts() {
    return this.challengeService.findAll();
  }

  @Get('mine')
  getUserPosts(@Req() request: Request) {
    const userId = request['user']['id'];
    return this.challengeService.findByUserId(userId);
  }

  @Post('create')
  createPost(@Req() request: Request, @Body() body: CreatePostDto) {
    const userId = request['user']['id'];
    return this.challengeService.create(userId, body);
  }

  @Patch('update/:id')
  updatePost(
    @Req() request: Request,
    @Body() body: UpdatePostDto,
    @Param('id', ParseUUIDPipe) challengeId: string,
  ) {
    const userId = request['user']['id'];
    return this.challengeService.update(userId, challengeId, body);
  }

  @Delete('delete/:id')
  deletePost(
    @Req() request: Request,
    @Param('id', ParseUUIDPipe) challengeId: string,
  ) {
    const userId = request['user']['id'];
    return this.challengeService.delete(userId, challengeId);
  }
}
