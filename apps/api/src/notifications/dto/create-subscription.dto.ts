import { createZodDto } from 'nestjs-zod';
import { PushSubscriptionSchema } from '@parking/schema';

export class CreateSubscriptionDto extends createZodDto(PushSubscriptionSchema) {}
