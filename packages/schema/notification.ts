import { z } from 'zod';

// A Web Push szabványos feliratkozási objektuma
export const PushSubscriptionSchema = z.object({
  endpoint: z.url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
  // Opcionális: expirationTime (néha küldi a böngésző)
  expirationTime: z.number().nullable().optional(),
});

export type PushSubscriptionInput = z.infer<typeof PushSubscriptionSchema>;
