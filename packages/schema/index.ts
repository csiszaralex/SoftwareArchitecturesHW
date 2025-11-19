import { z } from 'zod';

export const ParkingCategorySchema = z.enum(['FREE', 'PAID', 'P_PLUS_R', 'GARAGE', 'STREET']);

export const CreateParkingSpotSchema = z.object({
  name: z.string().min(3, 'A név legyen legalább 3 karakter').max(50),
  description: z.string().optional(),
  address: z.string().min(5, 'A cím legyen legalább 5 karakter'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  category: ParkingCategorySchema,
  images: z.array(z.url()).optional().default([]),
});

export type CreateParkingSpotInput = z.infer<typeof CreateParkingSpotSchema>;
