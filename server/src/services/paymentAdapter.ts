import { Request, Response, NextFunction } from 'express';
import { AppConfig } from '../config.js';
import { ProtectedRouteConfig, PaymentSettlementReceipt } from '../types.js';

export interface IPaymentMiddlewareProvider {
  createMiddleware(routes: Record<string, ProtectedRouteConfig>): (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
}

/**
 * MockPaymentAdapter for local development and deterministic test suites.
 * RFC HTTP 402 compatible: Returns structured requirements and handles mock authorizations.
 * NEVER creates fake transaction hashes or claims real on-chain settlement.
 */
export class MockPaymentAdapter implements IPaymentMiddlewareProvider {
  // Idempotency store to track authorization signatures and prevent replay / double spending
  private settledSignatures = new Map<string, { settledAt: string; receipt: PaymentSettlementReceipt }>();

  constructor(private config: AppConfig) {
    if (config.NODE_ENV === 'production') {
      throw new Error('FATAL: MockPaymentAdapter cannot be instantiated in production environment!');
    }
  }

  public createMiddleware(routes: Record<string, ProtectedRouteConfig>) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const routeKey = `${req.method.toUpperCase()} ${req.path}`;
      const routeConfig = routes[routeKey];

      // If not a protected route, proceed immediately
      if (!routeConfig) {
        return next();
      }

      // Check for payment signature headers (supports official x402 PAYMENT-SIGNATURE or custom header)
      const paymentSignature = req.header('PAYMENT-SIGNATURE') || req.header('x-payment-signature');

      if (!paymentSignature) {
        // Return RFC-compliant 402 Payment Required response
        const requirementsPayload = {
          x402Version: 2,
          error: 'PAYMENT_REQUIRED',
          message: 'Payment required to access this Bioscope insight resource.',
          isSimulated: true,
          modeNotice: 'SIMULATED PAYMENT — NO FUNDS TRANSFERRED',
          resource: {
            path: req.path,
            method: req.method,
            description: routeConfig.description
          },
          accepts: routeConfig.accepts
        };

        const encodedHeader = Buffer.from(JSON.stringify(requirementsPayload)).toString('base64');

        res.set({
          'WWW-Authenticate': 'x402',
          'PAYMENT-REQUIRED': encodedHeader,
          'Content-Type': 'application/json'
        });

        res.status(402).json(requirementsPayload);
        return;
      }

      // Validate payment authorization signature format
      const trimmedSignature = paymentSignature.trim();

      // Check for explicitly simulated invalid or malformed tokens in tests
      if (trimmedSignature === 'invalid' || trimmedSignature === 'malformed' || trimmedSignature.length < 8) {
        res.status(400).json({
          error: 'INVALID_PAYMENT_SIGNATURE',
          message: 'The provided payment authorization header is malformed or invalid.',
          isSimulated: true
        });
        return;
      }

      if (trimmedSignature === 'simulated-facilitator-fail') {
        res.status(502).json({
          error: 'FACILITATOR_VERIFICATION_FAILED',
          message: 'x402 facilitator verification failed or timed out.',
          isSimulated: true
        });
        return;
      }

      if (trimmedSignature === 'simulated-settlement-fail') {
        res.status(402).json({
          error: 'SETTLEMENT_FAILED',
          message: 'Payment settlement failed or has pending confirmation on network.',
          isSimulated: true
        });
        return;
      }

      // Check idempotency: prevent replay attack / duplicate settlement
      if (this.settledSignatures.has(trimmedSignature)) {
        const existing = this.settledSignatures.get(trimmedSignature)!;
        // Attach previous settlement header and allow fulfilled request without recharging
        res.set('PAYMENT-RESPONSE', Buffer.from(JSON.stringify(existing.receipt)).toString('base64'));
        (req as unknown as { paymentReceipt: PaymentSettlementReceipt }).paymentReceipt = existing.receipt;
        return next();
      }

      // Check if signature contains 'replay-error' instruction for testing
      if (trimmedSignature.includes('test-replay-reject')) {
        res.status(409).json({
          error: 'REPLAY_DETECTED',
          message: 'This payment authorization has already been submitted or expired.',
          isSimulated: true
        });
        return;
      }

      // Settle simulated payment
      const primaryAccept = routeConfig.accepts[0];
      const receipt: PaymentSettlementReceipt = {
        success: true,
        isSimulated: true,
        network: primaryAccept?.network || this.config.X402_NETWORK,
        asset: primaryAccept?.asset || this.config.X402_ASSET_ADDRESS,
        amount: primaryAccept?.price || '$0.001',
        payTo: primaryAccept?.payTo || this.config.PAYMENT_RECIPIENT_ADDRESS,
        settledAt: new Date().toISOString(),
        note: 'SIMULATED PAYMENT — NO FUNDS TRANSFERRED'
        // Transaction hash and explorer link are deliberately omitted in mock mode!
      };

      // Store in idempotency cache
      this.settledSignatures.set(trimmedSignature, {
        settledAt: receipt.settledAt,
        receipt
      });

      // Attach x402 PAYMENT-RESPONSE header
      const encodedReceipt = Buffer.from(JSON.stringify(receipt)).toString('base64');
      res.set({
        'PAYMENT-RESPONSE': encodedReceipt,
        'X-Payment-Settlement': 'simulated'
      });

      (req as unknown as { paymentReceipt: PaymentSettlementReceipt }).paymentReceipt = receipt;
      return next();
    };
  }

  public clearIdempotencyCache(): void {
    this.settledSignatures.clear();
  }
}
