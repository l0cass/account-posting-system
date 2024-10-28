import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './core/modules/auth/auth.module';
import { PostModule } from './core/modules/post/post.module';
import { UserModule } from './core/modules/user/user.module';

import { PostEntity } from './core/modules/post/post.entity';
import { UserEntity } from './core/modules/user/user.entity';

import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/modules/auth/guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
    }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        entities: [UserEntity, PostEntity],

        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH'),

        logging: true,
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UserModule,
    PostModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class RootModule {}
