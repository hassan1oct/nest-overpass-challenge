import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('LandmarksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/webhook (POST)', () => {
    return request(app.getHttpServer())
      .post('/webhook')
      .set('Authorization', `Bearer ${process.env.SECRET_KEY}`)
      .send({ lat: 48.8584, lng: 2.2945 })
      .expect(202);
  });

  it('/landmarks (GET)', () => {
    return request(app.getHttpServer())
      .get('/landmarks?lat=48.8584&lng=2.2945')
      .expect(200);
  });
});