/**
 * Bioscope AI — x402 CLI Payment Client
 *
 * Demonstrates the full x402 payment flow:
 * 1. Initial Unpaid Request -> Server challenges with HTTP 402 + Payment Requirements
 * 2. Authorization / Signing:
 *    - In TESTNET mode: viem signs EIP-712 payload via official @x402/fetch & @x402/evm client scheme
 *    - In MOCK mode: sends simulated authorization header without private key
 * 3. Payment Retry -> Server verifies & settles -> Delivers 200 OK Insight + PAYMENT-RESPONSE receipt
 *
 * Usage:
 *   npx tsx examples/pay-client.ts
 *
 * For Real Base Sepolia Settlement:
 *   Set TESTNET_PRIVATE_KEY=0x... in local .env (funded with Base Sepolia testnet ETH + testnet USDC)
 */

import dotenv from 'dotenv';
import { privateKeyToAccount } from 'viem/accounts';
import { wrapFetchWithPaymentFromConfig, decodePaymentResponseHeader } from '@x402/fetch';
import { ExactEvmScheme } from '@x402/evm/exact/client';

dotenv.config();

const API_BASE_URL = process.env.API_URL || `http://localhost:${process.env.PORT || 4000}`;
const TARGET_ENDPOINT = `${API_BASE_URL}/api/paid/city`;
const REQUEST_PAYLOAD = {
  city: 'Nashik',
  interests: ['vineyards', 'temples', 'culinary']
};

async function main() {
  console.log(`\n===============================================================`);
  console.log(`🎬 Bioscope AI — x402 Pay-Per-Insight CLI Client`);
  console.log(`🎯 Target Endpoint: ${TARGET_ENDPOINT}`);
  console.log(`📦 Request Payload:`, JSON.stringify(REQUEST_PAYLOAD, null, 2));
  console.log(`===============================================================\n`);

  // Step 1: Initial Unpaid Request
  console.log(`[Step 1] Sending initial unpaid request to protected endpoint...`);
  const unpaidResponse = await fetch(TARGET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(REQUEST_PAYLOAD)
  });

  console.log(`\n[Server Response] HTTP Status: ${unpaidResponse.status} ${unpaidResponse.statusText}`);
  const authHeader = unpaidResponse.headers.get('WWW-Authenticate');
  const paymentRequiredHeader = unpaidResponse.headers.get('PAYMENT-REQUIRED');
  console.log(`[Header] WWW-Authenticate: ${authHeader}`);
  console.log(`[Header] PAYMENT-REQUIRED: ${paymentRequiredHeader ? (paymentRequiredHeader.slice(0, 48) + '...') : 'None'}`);

  const unpaidBody = await unpaidResponse.json();
  console.log(`[Body] 402 Challenge Payload:\n`, JSON.stringify(unpaidBody, null, 2));

  if (unpaidResponse.status !== 402) {
    console.log(`⚠️ Expected HTTP 402, received ${unpaidResponse.status}`);
    return;
  }

  // Step 2: Payment Authorization & Retry
  const privateKey = process.env.TESTNET_PRIVATE_KEY;

  if (privateKey && privateKey.startsWith('0x') && privateKey.length === 66) {
    console.log(`\n---------------------------------------------------------------`);
    console.log(`🔐 TESTNET PAYMENT DETECTED`);
    console.log(`Using real EVM account to sign payment for Base Sepolia (eip155:84532)...`);
    console.log(`---------------------------------------------------------------\n`);

    const account = privateKeyToAccount(privateKey as `0x${string}`);
    console.log(`Wallet address: ${account.address}`);

    const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
      schemes: [
        {
          network: 'eip155:84532',
          client: new ExactEvmScheme(account)
        }
      ]
    });

    console.log(`[Step 2] Sending paid request via @x402/fetch wrapper...`);
    const paidResponse = await fetchWithPayment(TARGET_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(REQUEST_PAYLOAD)
    });

    console.log(`\n[Server Response] HTTP Status: ${paidResponse.status} ${paidResponse.statusText}`);
    const paymentResponseHeader = paidResponse.headers.get('PAYMENT-RESPONSE');

    if (paymentResponseHeader) {
      const decodedSettlement = decodePaymentResponseHeader(paymentResponseHeader);
      console.log(`\n📜 [Settlement Confirmation Header]:\n`, JSON.stringify(decodedSettlement, null, 2));
      if (decodedSettlement && typeof decodedSettlement === 'object' && 'transaction' in decodedSettlement) {
        console.log(`🔗 BaseScan Explorer: https://sepolia.basescan.org/tx/${(decodedSettlement as { transaction: string }).transaction}`);
      }
    }

    const responseData = await paidResponse.json();
    console.log(`\n🎉 [Delivered Protected Insight]:\n`, JSON.stringify(responseData, null, 2));
  } else {
    // Local / Dev Mock Flow
    console.log(`\n---------------------------------------------------------------`);
    console.log(`💡 RUNNING IN SIMULATED PAYMENT DEMO MODE`);
    console.log(`(No TESTNET_PRIVATE_KEY configured. Using simulated authorization token.)`);
    console.log(`---------------------------------------------------------------\n`);

    const mockSignature = `mock-auth-sig-${Date.now()}`;
    console.log(`[Step 2] Retrying request with PAYMENT-SIGNATURE: ${mockSignature}...`);

    const paidResponse = await fetch(TARGET_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYMENT-SIGNATURE': mockSignature
      },
      body: JSON.stringify(REQUEST_PAYLOAD)
    });

    console.log(`\n[Server Response] HTTP Status: ${paidResponse.status} ${paidResponse.statusText}`);
    const paymentResponseHeader = paidResponse.headers.get('PAYMENT-RESPONSE');

    if (paymentResponseHeader) {
      try {
        const decoded = JSON.parse(Buffer.from(paymentResponseHeader, 'base64').toString('utf8'));
        console.log(`\n📜 [Payment Settlement Receipt Header]:\n`, JSON.stringify(decoded, null, 2));
      } catch {
        console.log(`[Header] PAYMENT-RESPONSE:`, paymentResponseHeader);
      }
    }

    const responseData = await paidResponse.json();
    console.log(`\n🎉 [Delivered Protected Insight]:\n`, JSON.stringify(responseData, null, 2));
  }

  console.log(`\n===============================================================`);
  console.log(`✅ x402 Flow Completed Successfully!`);
  console.log(`===============================================================\n`);
}

main().catch((err) => {
  console.error(`❌ Pay-Client Error:`, err);
  process.exit(1);
});
