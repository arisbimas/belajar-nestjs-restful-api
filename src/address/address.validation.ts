import z, { ZodType } from 'zod';
import {
  CreateAddressRequest,
  GetAddressRequest,
} from '../model/address.model';

export class AddressValidation {
  static readonly CREATE: ZodType<CreateAddressRequest> = z.object({
    contact_id: z.number().int().positive(),
    street: z.string().min(1).max(255).optional(),
    city: z.string().min(1).max(100).optional(),
    province: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(10),
  });

  static readonly GET: ZodType<GetAddressRequest> = z.object({
    contact_id: z.number().int().min(1).positive(),
    address_id: z.number().int().min(1).positive(),
  });
}
