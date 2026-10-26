export interface BioscopeExperience {
  id: string;
  title: string;
  shortTagline: string;
  description: string;
  endpoint: string;
  method: 'POST';
  priceUsd: string;
  previewPrompt: string;
  previewSample: string;
  requiredFields: {
    name: string;
    type: string;
    required: boolean;
    options?: string[];
    description: string;
  }[];
}

export interface PaymentSettlementReceipt {
  success: boolean;
  isSimulated: boolean;
  network: string;
  asset: string;
  amount: string;
  payTo: string;
  transactionHash?: string;
  blockExplorerUrl?: string;
  settledAt: string;
  note: string;
}

export interface HealthInfo {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  payment: {
    mode: 'testnet' | 'mock';
    isSimulated: boolean;
    network: string;
    recipient: string;
    facilitator: string;
    asset: string;
  };
  environment: string;
}

export interface X402PaymentRequirement {
  scheme: string;
  price: string;
  network: string;
  payTo: string;
  maxTimeoutSeconds?: number;
  asset?: string;
}

export interface X402ChallengeResponse {
  x402Version: number;
  error: string;
  message: string;
  isSimulated: boolean;
  modeNotice?: string;
  resource: {
    path: string;
    method: string;
    description: string;
  };
  accepts: X402PaymentRequirement[];
}
