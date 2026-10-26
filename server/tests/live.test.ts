import { describe, it, expect } from 'vitest';
import dotenv from 'dotenv';
import { privateKeyToAccount } from 'viem/accounts';
import { wrapFetchWithPaymentFromConfig, decodePaymentResponseHeader } from '@x402/fetch';
import { ExactEvmScheme } from '@x402/evm/exact/client';

dotenv.config();

describe('Live Base Sepolia Testnet Settlement (Optional)', () => {
  const privateKey = process.env.TESTNET_PRIVATE_KEY;
  const apiUrl = process.env.LIVE_API_URL || 'http://localhost:4000';

  if (!privateKey || !privateKey.startsWith('0x') || privateKey.length !== 66) {
    it.skip('Skipped live testnet test: TESTNET_PRIVATE_KEY not provided in environment', () => {
      // Skipped honestly
    });
    return;
  }

  it('Executes genuine on-chain payment settlement on Base Sepolia', async () => {
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
      schemes: [
        {
          network: 'eip155:84532',
          client: new ExactEvmScheme(account)
        }
      ]
    });

    const res = await fetchWithPayment(`${apiUrl}/api/paid/city`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: 'Nashik' })
    });

    expect(res.status).toBe(200);
    const paymentHeader = res.headers.get('PAYMENT-RESPONSE');
    expect(paymentHeader).toBeTruthy();

    if (paymentHeader) {
      const decoded = decodePaymentResponseHeader(paymentHeader);
      expect(decoded).toBeDefined();
      console.log('Real Testnet Transaction Settled:', decoded);
    }
  }, 45000);
});
