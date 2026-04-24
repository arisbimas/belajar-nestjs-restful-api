import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { AddressValidation } from './address.validation';
import { Address, User } from '../../generated/prisma/client';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
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

  toAddressResponse(address: Address): AddressResponse {
    return {
      id: address.id,
      street: address.street as string,
      city: address.city as string,
      province: address.province as string,
      country: address.country,
      postal_code: address.postal_code as string,
    };
  }

  async checkAddressMustExist(contactId: number, addressId: number) {
    const address = await this.prismaService.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }
    return address;
  }

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.info(
      `AddressService.create(${user.username}, ${JSON.stringify(request)})`,
    );
    const createRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );

    await this.contactService.checkContactMustExist(
      user.username,
      createRequest.contact_id,
    );

    const address: Address = await this.prismaService.address.create({
      data: createRequest,
    });

    return this.toAddressResponse(address);
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    this.logger.info(
      `AddressService.get(${user.username}, ${JSON.stringify(request)})`,
    );

    const getRequest = this.validationService.validate(
      AddressValidation.GET,
      request,
    );

    await this.contactService.checkContactMustExist(
      user.username,
      getRequest.contact_id,
    );

    const address = await this.checkAddressMustExist(
      getRequest.contact_id,
      getRequest.address_id,
    );

    return this.toAddressResponse(address);
  }

  async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.info(
      `AddressService.update(${user.username}, ${JSON.stringify(request)})`,
    );

    const updateRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    );

    await this.contactService.checkContactMustExist(
      user.username,
      updateRequest.contact_id,
    );

    let address = await this.checkAddressMustExist(
      updateRequest.contact_id,
      updateRequest.id,
    );

    address = await this.prismaService.address.update({
      where: {
        id: updateRequest.id,
        contact_id: updateRequest.contact_id,
      },
      data: updateRequest,
    });

    return this.toAddressResponse(address);
  }
}
