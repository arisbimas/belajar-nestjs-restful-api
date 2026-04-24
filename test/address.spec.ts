import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { Address, Contact } from '../generated/prisma/client';
import { AddressResponse } from '../src/model/address.model';

describe('AddressController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
    testService = app.get<TestService>(TestService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if request is invalid', async () => {
      const contact: Contact = (await testService.getContact())!;
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', `test`)
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(`Response ${JSON.stringify(response.body)}`);
      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to create a new address', async () => {
      const contact: Contact = (await testService.getContact())!;
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', `test`)
        .send({
          street: 'test',
          city: 'test',
          province: 'test',
          country: 'test',
          postal_code: '1111',
        });

      logger.info(`Response ${JSON.stringify(response.body)}`);
      const dataBody = (response.body as { data: AddressResponse }).data;
      expect(response.status).toBe(200);
      expect(dataBody.id).toBeDefined();
      expect(dataBody.street).toBe('test');
      expect(dataBody.city).toBe('test');
      expect(dataBody.province).toBe('test');
      expect(dataBody.country).toBe('test');
      expect(dataBody.postal_code).toBe('1111');
    });
  });

  describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if contact is not found', async () => {
      const contact: Contact = (await testService.getContact())!;
      const address: Address = (await testService.getAddress())!;
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', `test`);

      logger.info(`Response ${JSON.stringify(response.body)}`);
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const contact: Contact = (await testService.getContact())!;
      const address: Address = (await testService.getAddress())!;
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', `test`);

      logger.info(`Response ${JSON.stringify(response.body)}`);
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to get address', async () => {
      const contact: Contact = (await testService.getContact())!;
      const address: Address = (await testService.getAddress())!;
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', `test`);

      logger.info(`Response ${JSON.stringify(response.body)}`);
      const dataBody = (response.body as { data: AddressResponse }).data;
      expect(response.status).toBe(200);
      expect(dataBody.id).toBeDefined();
      expect(dataBody.street).toBe('test');
      expect(dataBody.city).toBe('test');
      expect(dataBody.province).toBe('test');
      expect(dataBody.country).toBe('test');
      expect(dataBody.postal_code).toBe('1111');
    });
  });

  describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if request is invalid', async () => {
      const contact: Contact = (await testService.getContact())!;
      const address: Address = (await testService.getAddress())!;
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', `test`)
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(`Response ${JSON.stringify(response.body)}`);
      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to update address', async () => {
      const contact: Contact = (await testService.getContact())!;
      const address: Address = (await testService.getAddress())!;
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', `test`)
        .send({
          street: 'test update',
          city: 'test update',
          province: 'test update',
          country: 'test update',
          postal_code: '11112',
        });

      logger.info(`Response ${JSON.stringify(response.body)}`);
      const dataBody = (response.body as { data: AddressResponse }).data;
      expect(response.status).toBe(200);
      expect(dataBody.id).toBeDefined();
      expect(dataBody.street).toBe('test update');
      expect(dataBody.city).toBe('test update');
      expect(dataBody.province).toBe('test update');
      expect(dataBody.country).toBe('test update');
      expect(dataBody.postal_code).toBe('11112');
    });

    it('should be rejected if contact is not found', async () => {
      const contact: Contact = (await testService.getContact())!;
      const address: Address = (await testService.getAddress())!;
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', `test`)
        .send({
          street: 'test',
          city: 'test',
          province: 'test',
          country: 'test',
          postal_code: '1111',
        });

      logger.info(`Response ${JSON.stringify(response.body)}`);
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const contact: Contact = (await testService.getContact())!;
      const address: Address = (await testService.getAddress())!;
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', `test`)
        .send({
          street: 'test',
          city: 'test',
          province: 'test',
          country: 'test',
          postal_code: '1111',
        });

      logger.info(`Response ${JSON.stringify(response.body)}`);
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });
  });
});
