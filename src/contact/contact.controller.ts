import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Auth } from '../common/auth.decorator';
import { ContactResponse, CreateContactRequest } from '../model/contact.model';
import { WebResponse } from '../model/web.model';
import type { User } from '../../generated/prisma/client';

@Controller('api/contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    const contact = await this.contactService.create(user, request);
    return {
      data: contact,
    };
  }
}
