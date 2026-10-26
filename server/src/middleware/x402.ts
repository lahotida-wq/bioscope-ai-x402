import { Request, Response, NextFunction } from 'express';
import { paymentMiddleware, x402ResourceServer } from '@x402/express';
import { HTTPFacilitatorClient, type RoutesConfig, type RouteConfig } from '@x402/core/server';
import type { Network } from '@x402/core/types';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { AppConfig } from '../config.js';
import { ProtectedRouteConfig } from '../types.js';
import { MockPaymentAdapter } from '../services/paymentAdapter.js';

export function getProtectedRoutesConfig(config: AppConfig): Record<string, ProtectedRouteConfig> {
  return {
    'POST /api/paid/city': {
      accepts: [
        {
          scheme: 'exact',
          price: config.PRICE_CITY_BIOSCOPE,
          network: config.X402_NETWORK,
          payTo: config.PAYMENT_RECIPIENT_ADDRESS,
          maxTimeoutSeconds: 60,
          asset: config.X402_ASSET_ADDRESS
        }
      ],
      description: 'City Bioscope — Deep Cultural, Culinary & Travel Insights'
    },
    'POST /api/paid/explain': {
      accepts: [
        {
          scheme: 'exact',
          price: config.PRICE_EXPLAIN_BIOSCOPE,
          network: config.X402_NETWORK,
          payTo: config.PAYMENT_RECIPIENT_ADDRESS,
          maxTimeoutSeconds: 60,
          asset: config.X402_ASSET_ADDRESS
        }
      ],
      description: 'Explainer Bioscope — Verifiable Technical & Cryptographic Distillations'
    },
    'POST /api/paid/developer': {
      accepts: [
        {
          scheme: 'exact',
          price: config.PRICE_DEVELOPER_BIOSCOPE,
          network: config.X402_NETWORK,
          payTo: config.PAYMENT_RECIPIENT_ADDRESS,
          maxTimeoutSeconds: 60,
          asset: config.X402_ASSET_ADDRESS
        }
      ],
      description: 'Developer Bioscope — Executable Architecture & x402 API Contracts'
    }
  };
}

export function createPaymentMiddleware(
  config: AppConfig,
  mockAdapterOverride?: MockPaymentAdapter
): (req: Request, res: Response, next: NextFunction) => Promise<void> | void {
  const routes = getProtectedRoutesConfig(config);

  if (config.PAYMENT_MODE === 'mock') {
    const adapter = mockAdapterOverride || new MockPaymentAdapter(config);
    return adapter.createMiddleware(routes);
  }

  // Real Testnet Mode using Official @x402/express + @x402/evm + @x402/core
  const facilitator = new HTTPFacilitatorClient({
    url: config.X402_FACILITATOR_URL
  });

  const networkKey = config.X402_NETWORK as Network;
  const resourceServer = new x402ResourceServer(facilitator).register(
    networkKey,
    new ExactEvmScheme()
  );

  const officialRoutesConfig: RoutesConfig = Object.fromEntries(
    Object.entries(routes).map(([pattern, cfg]) => [
      pattern,
      {
        description: cfg.description,
        accepts: cfg.accepts.map((acc) => ({
          scheme: acc.scheme,
          payTo: acc.payTo,
          price: acc.price,
          network: acc.network as Network,
          maxTimeoutSeconds: acc.maxTimeoutSeconds,
          extra: acc.asset ? { asset: acc.asset } : undefined
        }))
      } satisfies RouteConfig
    ])
  );

  // syncFacilitatorOnStart set to false to avoid blocking server boot if offline/in testnet transition
  return paymentMiddleware(officialRoutesConfig, resourceServer, undefined, undefined, false);
}
