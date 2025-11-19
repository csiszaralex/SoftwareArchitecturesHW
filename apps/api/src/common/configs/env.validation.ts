import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(10),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.url(),
  FRONTEND_URL: z.url(),
});

export type EnvConfig = z.infer<typeof envSchema>;
