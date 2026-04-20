import { ErrorFilter } from './../common/error.filter';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { APP_FILTER } from '@nestjs/core';
import { ValidationService } from '../common/validation.service';
@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class UserModule {}
