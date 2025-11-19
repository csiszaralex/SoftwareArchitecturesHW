import { StartParkingSchema } from '@parking/schema';
import { createZodDto } from 'nestjs-zod';

export class StartParkingDto extends createZodDto(StartParkingSchema) {}
