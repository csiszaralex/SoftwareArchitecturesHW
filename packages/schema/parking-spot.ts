import z from 'zod';

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

export const SearchParkingSpotSchema = z
  .object({
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
    radius: z.coerce.number().positive().default(1000),
  })
  .refine(data => (data.lat && data.lng) || (!data.lat && !data.lng), {
    message: 'Vagy mindkét koordinátát add meg, vagy egyiket sem!',
  });
export type SearchParkingSpotInput = z.infer<typeof SearchParkingSpotSchema>;

//TODO: ujragondolni ez kell-e
export interface ParkingSpotResponse {
  id: string;
  name: string;
  description?: string | null;
  address: string;
  lat: number;
  lng: number;
  category: 'FREE' | 'PAID' | 'P_PLUS_R' | 'GARAGE' | 'STREET';
  images: string[];
  distance?: number; // Ez az extra mező a geokeresésnél
}
