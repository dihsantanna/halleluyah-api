import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).default('4000'),

  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),

  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  HASHID_SALT: z.string(),
  HASHID_MIN_LENGTH: z.string().transform(Number).default('6'),
  HASHID_ALPHABET: z
    .string()
    .default('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
