import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'src/domain/dtos/user';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signIn(body: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOneBy({ email: body.email });

      if (!user) throw new NotFoundException('Bad credentials');

      const passwordsMatch = bcrypt.compare(user.password, body.password);

      if (!passwordsMatch) throw new UnauthorizedException('Bad credentials');

      return {
        status: HttpStatus.OK,
        accessToken: await this.jwtService.signAsync({
          expiresIn: '7d',
          sub: user.id,
          role: user.role,
          name: user.name,
          issuer: 'auth/access',
        }),
      };
    } catch (error) {
      console.error((error as Error).message);
      throw new InternalServerErrorException();
    }
  }

  async signUp(body: CreateUserDto) {
    try {
      const salts = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(body.password, salts);

      const newUser = this.userRepository.create({
        name: body.name,
        email: body.email,
        username: body.username,
        password: hashPassword,
      });

      await this.userRepository.save(newUser);

      return { status: HttpStatus.CREATED, message: 'User created' };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT')
        throw new ConflictException('Email is already in use');

      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
