import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type EnvConfig = z.infer<typeof envSchema>;
