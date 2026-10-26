import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { ContentService } from '../../services/contentService.js';
import { PaymentSettlementReceipt } from '../../types.js';

const developerSchema = z.object({
  topic: z.string().trim().min(2, 'Topic must be at least 2 characters').max(120, 'Topic too long'),
  language: z.string().trim().max(30).optional().default('typescript')
});

export function createDeveloperRouter(contentService: ContentService): Router {
  const router = Router();

  router.post('/developer', (req: Request, res: Response) => {
    const parseResult = developerSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid request body for Developer Bioscope.',
        details: parseResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
      });
      return;
    }

    const { topic, language } = parseResult.data;
    const insight = contentService.getDeveloperInsight(topic, language);
    const receipt = (req as unknown as { paymentReceipt?: PaymentSettlementReceipt }).paymentReceipt;

    res.json({
      status: 'ok',
      experience: 'Developer Bioscope',
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
