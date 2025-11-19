import { z } from 'zod';

export const StartParkingSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  address: z.string().optional(),
  spotId: z.string().optional(),
  endsAt: z.iso.datetime().pipe(z.coerce.date()),
  notes: z.string().optional(),
});

export type StartParkingInput = z.infer<typeof StartParkingSchema>;

export interface ParkingSessionResponse {
  id: string;
  lat: number;
  lng: number;
  address?: string | null;
  startedAt: Date;
  endsAt?: Date | null;
  notes?: string | null;
  isActive: boolean;
}
