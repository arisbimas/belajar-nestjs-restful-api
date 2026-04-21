import { PrismaService } from './../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bycript from 'bcrypt';

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
}
