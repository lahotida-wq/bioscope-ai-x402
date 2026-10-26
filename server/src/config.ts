import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PAYMENT_MODE: z.enum(['testnet', 'mock']).default('mock'),
  PAYMENT_RECIPIENT_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid 42-character EVM hex address')
    .default('0x000000000000000000000000000000000000dEaD'),
  X402_FACILITATOR_URL: z.string().url().default('https://x402.org/facilitator'),
  X402_NETWORK: z.string().default('eip155:84532'),
  X402_ASSET_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid 42-character EVM hex address')
    .default('0x036CbD53842c5426634e7929541eC2318f3dCF7e'),
  PRICE_CITY_BIOSCOPE: z.string().regex(/^\$\d+(\.\d+)?$/, 'Price must be in $0.00 format').default('$0.001'),
  PRICE_EXPLAIN_BIOSCOPE: z.string().regex(/^\$\d+(\.\d+)?$/, 'Price must be in $0.00 format').default('$0.002'),
  PRICE_DEVELOPER_BIOSCOPE: z.string().regex(/^\$\d+(\.\d+)?$/, 'Price must be in $0.00 format').default('$0.001'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  OPENAI_API_KEY: z.string().optional().default(''),
  AI_MODEL: z.string().default('gpt-4o-mini'),
  AI_TIMEOUT_MS: z.coerce.number().default(10000),
}).refine(
  (data) => {
    // CRITICAL SECURITY RULE: Mock mode strictly prohibited in production!
    if (data.NODE_ENV === 'production' && data.PAYMENT_MODE === 'mock') {
      return false;
    }
    return true;
  },
  {
    message: 'FATAL SECURITY CONSTRAINT: PAYMENT_MODE cannot be "mock" when NODE_ENV is "production". Production deployments must enforce real x402 testnet or mainnet settlement.',
    path: ['PAYMENT_MODE'],
  }
);

export type AppConfig = z.infer<typeof envSchema>;

export function loadConfig(overrideEnv?: Record<string, string | undefined>): AppConfig {
  const envToValidate = overrideEnv || process.env;
  const parsed = envSchema.safeParse(envToValidate);

  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => ` - [${issue.path.join('.')}]: ${issue.message}`)
      .join('\n');
    throw new Error(`Configuration validation failed on startup:\n${errorDetails}`);
  }

  return parsed.data;
}

export const config = loadConfig();
