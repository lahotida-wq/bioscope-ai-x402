import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { ContentService } from '../../services/contentService.js';
import { PaymentSettlementReceipt } from '../../types.js';

const citySchema = z.object({
  city: z.string().trim().min(2, 'City name must be at least 2 characters').max(60, 'City name too long'),
  interests: z.array(z.string().trim().max(30)).max(10).optional()
});

export function createCityRouter(contentService: ContentService): Router {
  const router = Router();

  router.post('/city', (req: Request, res: Response) => {
    const parseResult = citySchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid request body for City Bioscope.',
        details: parseResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
      });
      return;
    }

    const { city, interests } = parseResult.data;
    const insight = contentService.getCityInsight(city, interests);

    // Retrieve settlement info attached by x402 middleware if present
    const receipt = (req as unknown as { paymentReceipt?: PaymentSettlementReceipt }).paymentReceipt;

    res.json({
      status: 'ok',
      experience: 'City Bioscope',
      timestamp: new Date().toISOString(),
      data: insight,
      settlement: receipt || {
        success: true,
        isSimulated: false,
        note: 'Settled via x402 Facilitator'
      }
    });
  });

  return router;
}
