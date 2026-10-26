export type PaymentMode = 'testnet' | 'mock';

export interface RouteAcceptRequirement {
  scheme: string;
  price: string;
  network: string;
  payTo: string;
  maxTimeoutSeconds?: number;
  asset?: string;
}

export interface ProtectedRouteConfig {
  accepts: RouteAcceptRequirement[];
  description: string;
}

export interface CityInsight {
  city: string;
  tagline: string;
  historicalContext: string;
  highlights: string[];
  hiddenGems: string[];
  shortItinerary: { day: string; activities: string[] }[];
  travelTips: string[];
  bestSeason: string;
  culinaryDelights: string[];
  contentNotice: 'SAMPLE CONTENT' | 'LIVE CONTENT';
}

export interface ExplainerInsight {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  summary: string;
  keyPoints: string[];
  concreteExample: string;
  keyTakeaway: string;
  executionMode: 'DEMO IMPLEMENTATION' | 'LIVE AI INFERENCE';
}

export interface DeveloperInsight {
  topic: string;
  explanation: string;
  concepts: string[];
  nextSteps: string[];
  codeSnippet: string;
  copyableApiExample: {
    curl: string;
    requestBody: Record<string, unknown>;
    responseBody: Record<string, unknown>;
  };
  contentNotice: 'SAMPLE CONTENT' | 'LIVE CONTENT';
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
