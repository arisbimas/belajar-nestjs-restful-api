import {
  UserResponse,
  RegisterUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
} from './../model/user.model';
import { ValidationService } from './../common/validation.service';
import { UserValidation } from './user.validation';
import { PrismaService } from './../common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from '../../generated/prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Register New User ${JSON.stringify(request)}`);
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(
        UserValidation.REGISTER,
        request,
      ) as RegisterUserRequest;

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername > 0) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info(`UserService.login ${JSON.stringify(request)}`);
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    ) as LoginUserRequest;

    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = randomUUID();

    await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        token,
      },
    });

    return {
      username: user.username,
      name: user.name,
      token,
    };
  }

  get(user: User): UserResponse {
    return {
      username: user.username,
      name: user.name,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.info(
      `UserService.update user: ${JSON.stringify(user)}, request: ${JSON.stringify(
        request,
      )}`,
    );
    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    ) as UpdateUserRequest;

    if (updateRequest.name) user.name = updateRequest.name;
    if (updateRequest.password)
      user.password = await bcrypt.hash(updateRequest.password, 10);

    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return {
      username: result.username,
      name: result.name,
    };
  }
}
