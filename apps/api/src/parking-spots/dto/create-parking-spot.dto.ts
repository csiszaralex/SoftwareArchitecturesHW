import { CreateParkingSpotSchema } from '@parking/schema';
import { createZodDto } from 'nestjs-zod';

export class CreateParkingSpotDto extends createZodDto(CreateParkingSpotSchema) {}
