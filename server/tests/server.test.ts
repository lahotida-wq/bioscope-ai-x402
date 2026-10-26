import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadConfig } from '../src/config.js';
import { MockPaymentAdapter } from '../src/services/paymentAdapter.js';

describe('Bioscope AI Server Test Suite', () => {
  let baseConfig = loadConfig({
    PORT: '4000',
    NODE_ENV: 'test',
    PAYMENT_MODE: 'mock',
    PAYMENT_RECIPIENT_ADDRESS: '0x000000000000000000000000000000000000dEaD',
    X402_FACILITATOR_URL: 'https://x402.org/facilitator',
    X402_NETWORK: 'eip155:84532',
    PRICE_CITY_BIOSCOPE: '$0.001',
    PRICE_EXPLAIN_BIOSCOPE: '$0.002',
    PRICE_DEVELOPER_BIOSCOPE: '$0.001',
    CORS_ORIGIN: '*',
    RATE_LIMIT_WINDOW_MS: '60000',
    RATE_LIMIT_MAX_REQUESTS: '20'
  });

  let mockAdapter: MockPaymentAdapter;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    mockAdapter = new MockPaymentAdapter(baseConfig);
    app = createApp(baseConfig, mockAdapter);
  });

  // 1. Health Endpoint
  it('GET /api/health returns ok status and server metadata', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('Bioscope AI — Pay Per Insight');
    expect(res.body.payment.mode).toBe('mock');
    expect(res.body.payment.network).toBe('eip155:84532');
  });

  // 2. Experiences Catalog
  it('GET /api/experiences returns public catalog with prices and preview data', async () => {
    const res = await request(app).get('/api/experiences');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.experiences)).toBe(true);
    expect(res.body.experiences.length).toBe(3);

    const cityExp = res.body.experiences.find((e: { id: string }) => e.id === 'city');
    expect(cityExp).toBeDefined();
    expect(cityExp.priceUsd).toBe('$0.001');
    expect(cityExp.endpoint).toBe('/api/paid/city');
  });

  // 3. Protected Endpoints: 402 Unpaid Challenge
  it('POST /api/paid/city returns 402 Payment Required when unpaid', async () => {
    const res = await request(app)
      .post('/api/paid/city')
      .send({ city: 'Nashik' });

    expect(res.status).toBe(402);
    expect(res.header['www-authenticate']).toBe('x402');
    expect(res.header['payment-required']).toBeDefined();
    expect(res.body.error).toBe('PAYMENT_REQUIRED');
    expect(res.body.x402Version).toBe(2);
    expect(res.body.accepts).toBeDefined();
    expect(res.body.accepts[0].price).toBe('$0.001');
    expect(res.body.accepts[0].network).toBe('eip155:84532');
    expect(res.body.modeNotice).toBe('SIMULATED PAYMENT — NO FUNDS TRANSFERRED');
  });

  it('POST /api/paid/explain returns 402 Payment Required when unpaid', async () => {
    const res = await request(app)
      .post('/api/paid/explain')
      .send({ topic: 'x402 Protocol', difficulty: 'beginner' });

    expect(res.status).toBe(402);
    expect(res.body.error).toBe('PAYMENT_REQUIRED');
    expect(res.body.accepts[0].price).toBe('$0.002');
  });

  it('POST /api/paid/developer returns 402 Payment Required when unpaid', async () => {
    const res = await request(app)
      .post('/api/paid/developer')
      .send({ topic: 'x402 Express Middleware', language: 'typescript' });

    expect(res.status).toBe(402);
    expect(res.body.error).toBe('PAYMENT_REQUIRED');
    expect(res.body.accepts[0].price).toBe('$0.001');
  });

  // 4. Content-Type Validation: 415 on non-JSON POST
  it('POST with non-JSON content-type returns 415 Unsupported Media Type', async () => {
    const res = await request(app)
      .post('/api/paid/city')
      .set('Content-Type', 'text/plain')
      .send('city=Nashik');

    expect(res.status).toBe(415);
    expect(res.body.error).toBe('UNSUPPORTED_MEDIA_TYPE');
  });

  // 5. Successful Fulfillment with Payment Authorization Header
  it('POST /api/paid/city fulfills request when valid payment signature is provided', async () => {
    const res = await request(app)
      .post('/api/paid/city')
      .set('PAYMENT-SIGNATURE', 'valid-mock-auth-sig-001')
      .send({ city: 'Nashik', interests: ['vineyards', 'temples'] });

    expect(res.status).toBe(200);
    expect(res.header['payment-response']).toBeDefined();
    expect(res.body.status).toBe('ok');
    expect(res.body.data.city).toBe('Nashik');
    expect(res.body.data.contentNotice).toBe('SAMPLE CONTENT');
    expect(res.body.data.highlights.length).toBeGreaterThan(0);
    expect(res.body.settlement.isSimulated).toBe(true);
    expect(res.body.settlement.note).toBe('SIMULATED PAYMENT — NO FUNDS TRANSFERRED');
  });

  it('POST /api/paid/explain delivers deterministic explainer when paid', async () => {
    const res = await request(app)
      .post('/api/paid/explain')
      .set('PAYMENT-SIGNATURE', 'valid-mock-auth-sig-002')
      .send({ topic: 'x402 Protocol', difficulty: 'intermediate' });

    expect(res.status).toBe(200);
    expect(res.body.data.topic).toContain('x402');
    expect(res.body.data.executionMode).toBe('DEMO IMPLEMENTATION');
    expect(res.body.data.keyPoints.length).toBeGreaterThan(0);
  });

  it('POST /api/paid/developer delivers technical blueprint and curl example when paid', async () => {
    const res = await request(app)
      .post('/api/paid/developer')
      .set('PAYMENT-SIGNATURE', 'valid-mock-auth-sig-003')
      .send({ topic: 'x402 Middleware' });

    expect(res.status).toBe(200);
    expect(res.body.data.copyableApiExample).toBeDefined();
    expect(res.body.data.copyableApiExample.curl).toContain('PAYMENT-SIGNATURE');
  });

  // 6. Request Body Validation (Zod Validation)
  it('Rejects invalid payload with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/paid/city')
      .set('PAYMENT-SIGNATURE', 'valid-mock-sig-city-invalid')
      .send({ city: '' }); // Invalid: minimum length 2

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  // 7. Malformed Payment Header Rejection
  it('Rejects malformed payment signature with 400', async () => {
    const res = await request(app)
      .post('/api/paid/city')
      .set('PAYMENT-SIGNATURE', 'short')
      .send({ city: 'Nashik' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_PAYMENT_SIGNATURE');
  });

  // 8. Facilitator Failure / Timeout Handling
  it('Handles simulated facilitator failure gracefully with 502', async () => {
    const res = await request(app)
      .post('/api/paid/city')
      .set('PAYMENT-SIGNATURE', 'simulated-facilitator-fail')
      .send({ city: 'Nashik' });

    expect(res.status).toBe(502);
    expect(res.body.error).toBe('FACILITATOR_VERIFICATION_FAILED');
  });

  // 9. Settlement Failure / Pending Handling
  it('Handles simulated settlement failure gracefully with 402', async () => {
    const res = await request(app)
      .post('/api/paid/city')
      .set('PAYMENT-SIGNATURE', 'simulated-settlement-fail')
      .send({ city: 'Nashik' });

    expect(res.status).toBe(402);
    expect(res.body.error).toBe('SETTLEMENT_FAILED');
  });

  // 10. Idempotency & Replay Handling
  it('Idempotently serves duplicate requests without charging twice', async () => {
    const sig = 'idempotent-unique-auth-test-999';

    // First request: settles and records
    const res1 = await request(app)
      .post('/api/paid/city')
      .set('PAYMENT-SIGNATURE', sig)
      .send({ city: 'Nashik' });
    expect(res1.status).toBe(200);

    // Second request with same signature: retrieves existing settlement
    const res2 = await request(app)
      .post('/api/paid/city')
      .set('PAYMENT-SIGNATURE', sig)
      .send({ city: 'Nashik' });
    expect(res2.status).toBe(200);
    expect(res2.header['payment-response']).toBe(res1.header['payment-response']);
  });

  it('Rejects replayed token when configured for strict replay rejection', async () => {
    const res = await request(app)
      .post('/api/paid/city')
      .set('PAYMENT-SIGNATURE', 'test-replay-reject-token')
      .send({ city: 'Nashik' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('REPLAY_DETECTED');
  });

  // 11. Security Guard: Mock mode strictly prohibited in production
  it('Refuses to load config or boot when NODE_ENV=production and PAYMENT_MODE=mock', () => {
    expect(() => {
      loadConfig({
        NODE_ENV: 'production',
        PAYMENT_MODE: 'mock',
        PAYMENT_RECIPIENT_ADDRESS: '0x000000000000000000000000000000000000dEaD'
      });
    }).toThrow(/FATAL SECURITY CONSTRAINT/);
  });

  // 12. Rate Limiting Test
  it('Throttles excessive requests when rate limit is exceeded', async () => {
    // Create an app with very low rate limit for test
    const lowRateConfig = {
      ...baseConfig,
      RATE_LIMIT_MAX_REQUESTS: 3
    };
    const throttledApp = createApp(lowRateConfig);

    await request(throttledApp).get('/api/health');
    await request(throttledApp).get('/api/health');
    await request(throttledApp).get('/api/health');
    const res = await request(throttledApp).get('/api/health');

    expect(res.status).toBe(429);
    expect(res.body.error).toBe('TOO_MANY_REQUESTS');
  });
});
