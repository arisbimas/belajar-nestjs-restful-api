import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { User } from '../../generated/prisma/client';
import { ContactResponse, CreateContactRequest } from '../model/contact.model';
import { ValidationService } from '../common/validation.service';
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.info(`ContactService.create(${JSON.stringify(request)})`);
    const createRequest: CreateContactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    ) as CreateContactRequest;
    const contact = await this.prismaService.contact.create({
      data: {
        ...createRequest,
        username: user.username,
      },
    });
    return {
      first_name: contact.first_name,
      last_name: contact.last_name as string,
      email: contact.email as string,
      phone: contact.phone as string,
      id: contact.id,
    };
  }
}
