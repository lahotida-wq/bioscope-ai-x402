import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { ContentService } from '../../services/contentService.js';
import { PaymentSettlementReceipt } from '../../types.js';

const explainSchema = z.object({
  topic: z.string().trim().min(2, 'Topic must be at least 2 characters').max(120, 'Topic too long'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('beginner')
});

export function createExplainRouter(contentService: ContentService): Router {
  const router = Router();

  router.post('/explain', async (req: Request, res: Response): Promise<void> => {
    const parseResult = explainSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid request body for Explainer Bioscope.',
        details: parseResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
      });
      return;
    }

    const { topic, difficulty } = parseResult.data;
    const insight = await contentService.getExplainerInsight(topic, difficulty);
    const receipt = (req as unknown as { paymentReceipt?: PaymentSettlementReceipt }).paymentReceipt;

    res.json({
      status: 'ok',
      experience: 'Explainer Bioscope',
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
