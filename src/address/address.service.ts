import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { AddressValidation } from './address.validation';
import { Address, User } from '../../generated/prisma/client';
import { AddressResponse, CreateAddressRequest } from '../model/address.model';
import { ValidationService } from '../common/validation.service';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {}

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.info('Creating address for user', { userId: user.username });
    const createRequest: CreateAddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    ) as CreateAddressRequest;

    await this.contactService.checkContactMustExist(
      user.username,
      createRequest.contact_id,
    );

    const address: Address = await this.prismaService.address.create({
      data: createRequest,
    });

    return {
      id: address.id,
      street: address.street as string,
      city: address.city as string,
      province: address.province as string,
      country: address.country,
      postal_code: address.postal_code as string,
    };
  }
}
