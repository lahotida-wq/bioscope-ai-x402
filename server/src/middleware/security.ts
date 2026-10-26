import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { AppConfig } from '../config.js';

export function setupSecurityMiddleware(config: AppConfig) {
  const allowedOrigins = config.CORS_ORIGIN.split(',').map((o) => o.trim());

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'PAYMENT-SIGNATURE', 'x-payment-signature', 'X-Requested-With'],
    exposedHeaders: ['WWW-Authenticate', 'PAYMENT-REQUIRED', 'PAYMENT-RESPONSE', 'X-Payment-Settlement'],
    credentials: true,
    maxAge: 86400
  };

  const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded. Please throttle your requests.',
      retryAfterSeconds: Math.ceil(config.RATE_LIMIT_WINDOW_MS / 1000)
    }
  });

  return {
    helmet: helmet({
      contentSecurityPolicy: false, // Allows flexible UI rendering and API consumption
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    }),
    cors: cors(corsOptions),
    limiter
  };
}

/**
 * Validates Content-Type for POST requests:
 * Rejects requests that post bodies without application/json with 415 Unsupported Media Type.
 */
export function validateContentType(req: Request, res: Response, next: NextFunction): void {
  if (req.method === 'POST') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      res.status(415).json({
        error: 'UNSUPPORTED_MEDIA_TYPE',
        message: 'Content-Type must be application/json for POST requests.'
      });
      return;
    }
  }
  next();
}

/**
 * Global safe error handler: prevents leaking stack traces, system paths, or secrets.
 */
export function safeErrorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const errorObj = err as Error & { status?: number; statusCode?: number };
  const statusCode = errorObj.statusCode || errorObj.status || 500;

  // Log error internally
  console.error(`[Server Error] [Status ${statusCode}]:`, errorObj.message);

  res.status(statusCode).json({
    error: statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR',
    message: statusCode === 500 ? 'An unexpected error occurred. Please try again later.' : errorObj.message
  });
}
