import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RootModule } from './../src/root.module';

describe('AppController (e2e)', () => {
  let root: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RootModule],
    }).compile();

    root = moduleFixture.createNestApplication();
    await root.init();
  });

  it('/ (GET)', () => {
    return request(root.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
