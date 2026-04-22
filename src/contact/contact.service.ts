import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { Contact, User } from '../../generated/prisma/client';
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
    return this.toContactResponse(contact);
  }

  toContactResponse(contact: Contact): ContactResponse {
    return {
      first_name: contact.first_name,
      last_name: contact.last_name as string,
      email: contact.email as string,
      phone: contact.phone as string,
      id: contact.id,
    };
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    this.logger.info(`ContactService.get(${user.username})`);
    const contact = await this.prismaService.contact.findFirst({
      where: {
        username: user.username,
        id: contactId,
      },
    });
    if (!contact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    return this.toContactResponse(contact);
  }
}
