import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll() {
    try {
      const users = await this.userRepository.find({
        select: {
          id: true,
          email: true,
          role: true,
          username: true,
          posts: true,
        },
        relations: { posts: true },
      });

      if (!users.length) throw new NotFoundException("Users don't exist");

      return { status: HttpStatus.OK, data: users };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException();
    }
  }

  async findById(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          username: true,
          posts: true,
        },
        relations: { posts: true },
      });

      if (!user) throw new NotFoundException("User doesn't exist");

      return { status: HttpStatus.OK, data: user };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException();
    }
  }
}
