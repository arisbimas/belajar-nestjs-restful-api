import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { ContactResponse } from '../src/model/contact.model';

describe('ContactController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
    testService = app.get<TestService>(TestService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', `test`)
        .send({
          first_name: '',
          last_name: '',
          email: 'invalid-email',
          phone: '',
        });

      logger.info(`Response ${JSON.stringify(response.body)}`);
      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to create a new contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', `test`)
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@example.com',
          phone: '1234567890',
        });

      logger.info(`Response ${JSON.stringify(response.body)}`);
      const contact = (response.body as { data: ContactResponse }).data;
      expect(response.status).toBe(200);
      expect(contact.id).toBeDefined();
      expect(contact.first_name).toBe('test');
      expect(contact.last_name).toBe('test');
      expect(contact.email).toBe('test@example.com');
      expect(contact.phone).toBe('1234567890');
    });
  });
});
