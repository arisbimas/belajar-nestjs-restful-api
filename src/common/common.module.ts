import { ValidationService } from './validation.service';
import { PrismaService } from './prisma.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'application.log' }),
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [PrismaService, ValidationService],
  exports: [PrismaService, ValidationService],
})
export class CommonModule {}
