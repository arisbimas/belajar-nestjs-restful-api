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
import { Contact } from '../generated/prisma/client';

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

  describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact is not found', async () => {
      const contact: Contact = (await testService.getContact())!;
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}`)
        .set('Authorization', `test`);

      logger.info(`Response ${JSON.stringify(response.body)}`);
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to get a contact', async () => {
      const contact: Contact = (await testService.getContact())!;
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('Authorization', `test`);

      logger.info(`Response ${JSON.stringify(response.body)}`);
      const body = (response.body as { data: ContactResponse }).data;
      expect(response.status).toBe(200);
      expect(body.id).toBe(contact.id);
      expect(body.first_name).toBe(contact.first_name);
      expect(body.last_name).toBe(contact.last_name);
      expect(body.email).toBe(contact.email);
      expect(body.phone).toBe('1234567890');
    });
  });

  describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if request is invalid', async () => {
      const contact: Contact = (await testService.getContact())!;
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
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

    it('should be rejected if contact is not found', async () => {
      const contact: Contact = (await testService.getContact())!;
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}`)
        .set('Authorization', `test`)
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@example.com',
          phone: '1234567890',
        });

      logger.info(`Response ${JSON.stringify(response.body)}`);
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to update an existing contact', async () => {
      const contact: Contact = (await testService.getContact())!;
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set('Authorization', `test`)
        .send({
          first_name: 'test updated',
          last_name: 'test updated',
          email: 'testupdated@example.com',
          phone: '12345678901',
        });

      logger.info(`Response ${JSON.stringify(response.body)}`);
      const body = (response.body as { data: ContactResponse }).data;
      expect(response.status).toBe(200);
      expect(body.id).toBe(contact.id);
      expect(body.first_name).toBe('test updated');
      expect(body.last_name).toBe('test updated');
      expect(body.email).toBe('testupdated@example.com');
      expect(body.phone).toBe('12345678901');
    });
  });

  describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact is not found', async () => {
      const contact: Contact = (await testService.getContact())!;
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}`)
        .set('Authorization', `test`);

      logger.info(`Response ${JSON.stringify(response.body)}`);
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to delete a contact', async () => {
      const contact: Contact = (await testService.getContact())!;
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}`)
        .set('Authorization', `test`);

      logger.info(`Response ${JSON.stringify(response.body)}`);
      const body = (response.body as { data: ContactResponse }).data;
      expect(response.status).toBe(200);
      expect(body).toBe(true);
    });
  });
});
