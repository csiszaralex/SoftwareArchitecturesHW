import { z } from 'zod';

export const parkingSpotSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
});

export type ParkingSpot = z.infer<typeof parkingSpotSchema>;
