import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  exports: [UserModule, UserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],

  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
