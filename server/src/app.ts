import express, { Express } from 'express';
import { AppConfig } from './config.js';
import { setupSecurityMiddleware, validateContentType, safeErrorHandler } from './middleware/security.js';
import { createPaymentMiddleware } from './middleware/x402.js';
import { MockPaymentAdapter } from './services/paymentAdapter.js';
import { ContentService } from './services/contentService.js';
import { createHealthRouter } from './routes/health.js';
import { createExperiencesRouter } from './routes/experiences.js';
import { createCityRouter } from './routes/paid/city.js';
import { createExplainRouter } from './routes/paid/explain.js';
import { createDeveloperRouter } from './routes/paid/developer.js';

export function createApp(config: AppConfig, mockAdapterOverride?: MockPaymentAdapter): Express {
  const app = express();

  // 1. Security middleware (helmet, cors, rate-limiter)
  const security = setupSecurityMiddleware(config);
  app.use(security.helmet);
  app.use(security.cors);
  app.use(security.limiter);

  // 2. Strict body parser: limit size to 50kb to prevent oversized payload attacks
  app.use(express.json({ limit: '50kb' }));

  // 3. Content-Type validator (enforces application/json for POST)
  app.use(validateContentType);

  // 4. Public endpoints (Health and Experiences Catalog)
  const healthRouter = createHealthRouter(config);
  const experiencesRouter = createExperiencesRouter(config);
  app.use('/api', healthRouter);
  app.use('/api', experiencesRouter);

  // 5. Official x402 Payment Protection Middleware
  // Protects /api/paid/city, /api/paid/explain, /api/paid/developer
  const x402Middleware = createPaymentMiddleware(config, mockAdapterOverride);
  app.use(x402Middleware);

  // 6. Paid Route Handlers (only executed when payment challenge has succeeded/settled)
  const contentService = new ContentService(config);
  const cityRouter = createCityRouter(contentService);
  const explainRouter = createExplainRouter(contentService);
  const developerRouter = createDeveloperRouter(contentService);

  app.use('/api/paid', cityRouter);
  app.use('/api/paid', explainRouter);
  app.use('/api/paid', developerRouter);

  // 7. 404 Handler
  app.use((_req, res) => {
    res.status(404).json({
      error: 'NOT_FOUND',
      message: 'The requested resource does not exist.'
    });
  });

  // 8. Safe Global Error Handler
  app.use(safeErrorHandler);

  return app;
}
