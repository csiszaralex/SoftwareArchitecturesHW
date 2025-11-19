import { SearchParkingSpotSchema } from '@parking/schema';
import { createZodDto } from 'nestjs-zod';

export class SearchParkingSpotDto extends createZodDto(SearchParkingSpotSchema) {}
