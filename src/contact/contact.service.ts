import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { Contact, Prisma, User } from '../../generated/prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from '../model/contact.model';
import { ValidationService } from '../common/validation.service';
import { ContactValidation } from './contact.validation';
import { WebResponse } from '../model/web.model';

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

  async checkContactMustExist(
    username: string,
    contactId: number,
  ): Promise<Contact> {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        username,
        id: contactId,
      },
    });
    if (!contact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    return contact;
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    this.logger.info(`ContactService.get(${user.username})`);
    const contact = await this.checkContactMustExist(user.username, contactId);
    return this.toContactResponse(contact);
  }

  async update(user: User, request: UpdateContactRequest) {
    this.logger.info(
      `ContactService.update(${user.username}, ${JSON.stringify(request)})`,
    );
    const updateRequest: UpdateContactRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request,
    ) as UpdateContactRequest;
    let contact = await this.checkContactMustExist(
      user.username,
      updateRequest.id,
    );

    contact = await this.prismaService.contact.update({
      where: {
        id: contact.id,
      },
      data: updateRequest,
    });
    return this.toContactResponse(contact);
  }

  async remove(user: User, contactId: number): Promise<ContactResponse> {
    this.logger.info(`ContactService.remove(${user.username}, ${contactId})`);
    await this.checkContactMustExist(user.username, contactId);
    const contact = await this.prismaService.contact.delete({
      where: {
        id: contactId,
        username: user.username,
      },
    });
    return this.toContactResponse(contact);
  }

  async search(
    user: User,
    request: SearchContactRequest,
  ): Promise<WebResponse<ContactResponse[]>> {
    this.logger.info(
      `ContactService.search(${user.username}, ${JSON.stringify(request)})`,
    );
    const searchRequest: SearchContactRequest = this.validationService.validate(
      ContactValidation.SEARCH,
      request,
    ) as SearchContactRequest;

    const filters: Prisma.ContactWhereInput[] = [];
    if (searchRequest.name) {
      filters.push({
        OR: [
          { first_name: { contains: searchRequest.name } },
          { last_name: { contains: searchRequest.name } },
        ],
      });
    }
    if (searchRequest.email) {
      filters.push({
        email: { contains: searchRequest.email },
      });
    }
    if (searchRequest.phone) {
      filters.push({
        phone: { contains: searchRequest.phone },
      });
    }

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const contacts = await this.prismaService.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: searchRequest.size,
      skip,
    });

    const totalContacts = await this.prismaService.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      data: contacts.map((contact) => this.toContactResponse(contact)),
      paging: {
        current_page: searchRequest.page,
        size: searchRequest.size,
        total_page: Math.ceil(totalContacts / searchRequest.size),
      },
    };
  }
}
