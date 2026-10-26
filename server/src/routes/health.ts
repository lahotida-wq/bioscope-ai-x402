import { Router, Request, Response } from 'express';
import { AppConfig } from '../config.js';

export function createHealthRouter(config: AppConfig): Router {
  const router = Router();
  const startTime = Date.now();

  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Bioscope AI — Pay Per Insight',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      payment: {
        mode: config.PAYMENT_MODE,
        isSimulated: config.PAYMENT_MODE === 'mock',
        network: config.X402_NETWORK,
        recipient: config.PAYMENT_RECIPIENT_ADDRESS,
        facilitator: config.X402_FACILITATOR_URL,
        asset: config.X402_ASSET_ADDRESS
      },
      environment: config.NODE_ENV
    });
  });

  return router;
}
