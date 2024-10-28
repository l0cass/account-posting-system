import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { PostEntity } from './post.entity';

import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  exports: [PostModule, PostService],
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
