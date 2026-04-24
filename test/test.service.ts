import { PrismaService } from './../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bycript from 'bcrypt';
import { Contact, User } from '../generated/prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async getUser(): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        password: await bycript.hash('test', 10),
        name: 'test',
        token: 'test',
      },
    });
  }

  async getContact() {
    return await this.prismaService.contact.findFirst({
      where: {
        username: 'test',
      },
    });
  }

  async createContact() {
    await this.prismaService.contact.create({
      data: {
        username: 'test',
        first_name: 'test',
        last_name: 'test',
        email: 'test@example.com',
        phone: '1234567890',
      },
    });
  }

  async deleteAddress() {
    await this.prismaService.address.deleteMany({
      where: {
        contact: {
          username: 'test',
        },
      },
    });
  }

  async createAddress() {
    const contact: Contact = (await this.getContact()) as Contact;
    await this.prismaService.address.create({
      data: {
        contact_id: contact.id,
        street: 'test',
        city: 'test',
        province: 'test',
        country: 'test',
        postal_code: '1111',
      },
    });
  }

  async getAddress() {
    return await this.prismaService.address.findFirst({
      where: {
        contact: {
          username: 'test',
        },
      },
    });
  }
}
