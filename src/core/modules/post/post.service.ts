import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PostEntity } from './post.entity';

import { CreatePostDto, UpdatePostDto } from 'src/domain/dtos/post';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async findAll() {
    try {
      const posts = await this.postRepository.find({
        select: { id: true, title: true, content: true },
        relations: { user: true },
      });

      if (!posts.length) throw new NotFoundException("Posts don't exist");

      return { status: HttpStatus.OK, data: posts };
    } catch (_) {
      throw new InternalServerErrorException();
    }
  }

  async findById(postId: string) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },

        select: { id: true, title: true, content: true },
        relations: { user: true },
      });

      if (!post) throw new NotFoundException("Post doesn't exist");

      return { status: HttpStatus.OK, data: post };
    } catch (_) {
      throw new InternalServerErrorException();
    }
  }

  async findByUserId(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },

        select: { posts: { id: true, title: true, content: true } },
        relations: { posts: true },
      });

      if (!user.posts) throw new NotFoundException("Posts don't exist");

      return { status: HttpStatus.OK, data: user.posts };
    } catch (_) {
      throw new InternalServerErrorException();
    }
  }

  async create(userId: string, body: CreatePostDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) throw new NotFoundException("User doesn't exist");

      const newPost = this.postRepository.create({
        user: user,
        title: body.title,
        content: body.content,
      });

      await this.postRepository.save(newPost);

      return { status: HttpStatus.CREATED, message: 'Post created' };
    } catch (_) {
      throw new InternalServerErrorException();
    }
  }

  async update(userId: string, postId: string, body: UpdatePostDto) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId, user: { id: userId } },
      });

      if (!post) throw new NotFoundException("Post doesn't exist");

      post.title = body.title ?? post.title;
      post.content = body.content ?? post.content;

      await this.postRepository.save(post);

      return { status: HttpStatus.OK, message: 'Post updated' };
    } catch (_) {
      throw new InternalServerErrorException();
    }
  }

  async delete(userId: string, postId: string) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId, user: { id: userId } },
      });

      if (!post) throw new NotFoundException("Post doesn't exist");

      await this.postRepository.remove(post);

      return { status: HttpStatus.OK, message: 'Post deleted' };
    } catch (_) {
      throw new InternalServerErrorException();
    }
  }
}
