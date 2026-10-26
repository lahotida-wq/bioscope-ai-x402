import { Router, Request, Response } from 'express';
import { AppConfig } from '../config.js';
import { BioscopeExperience } from '../types.js';

export function createExperiencesRouter(config: AppConfig): Router {
  const router = Router();

  const experiences: BioscopeExperience[] = [
    {
      id: 'city',
      title: 'City Bioscope',
      shortTagline: 'Unearth Secret Indian Heritage & Culinary Roots',
      description: 'Journey into curated cultural landscapes of historic Indian cities—from the Ramayana vineyards of Nashik to the royal pink sandstone ramparts of Jaipur and sacred riverbanks of Varanasi. Delivers rich historical context, hidden gems, short itineraries, and authentic culinary pairings.',
      endpoint: '/api/paid/city',
      method: 'POST',
      priceUsd: config.PRICE_CITY_BIOSCOPE,
      previewPrompt: 'Destination: Nashik (Wine, Ancient Temples, Kumbh Ghats)',
      previewSample: 'Nashik was named in the Ramayana where Lakshmana severed Surpanakha\'s nose. Today, it hosts both the sacred Trimbakeshwar Jyotirlinga and India\'s premier viticulture terroirs...',
      requiredFields: [
        {
          name: 'city',
          type: 'string',
          required: true,
          options: ['Nashik', 'Jaipur', 'Varanasi', 'Kochi', 'Mumbai'],
          description: 'Name of the city to explore'
        },
        {
          name: 'interests',
          type: 'string[]',
          required: false,
          options: ['heritage', 'culinary', 'vineyards', 'temples', 'art'],
          description: 'Optional focus areas'
        }
      ]
    },
    {
      id: 'explain',
      title: 'Explainer Bioscope',
      shortTagline: 'Crystalline Explanations for Frontier Protocols',
      description: 'Receive laser-focused, distilled technical breakdowns of complex cryptographic and distributed systems concepts. Features concise summaries, core mechanisms, mental models, and unforgettable takeaways—powered by live AI inference or deterministic demo benchmarks.',
      endpoint: '/api/paid/explain',
      method: 'POST',
      priceUsd: config.PRICE_EXPLAIN_BIOSCOPE,
      previewPrompt: 'Topic: x402 Protocol (Difficulty: Intermediate)',
      previewSample: 'x402 operationalizes the reserved HTTP 402 status code, establishing a stateless challenge-settlement loop directly between client wallets, servers, and facilitators...',
      requiredFields: [
        {
          name: 'topic',
          type: 'string',
          required: true,
          description: 'Technical topic, concept, or protocol to explain'
        },
        {
          name: 'difficulty',
          type: 'string',
          required: false,
          options: ['beginner', 'intermediate', 'advanced'],
          description: 'Target complexity level'
        }
      ]
    },
    {
      id: 'developer',
      title: 'Developer Bioscope',
      shortTagline: 'Copyable API Contracts & x402 Implementation Blueprints',
      description: 'Engineered for Web3 builders: get architectural blueprints, core conceptual breakdowns, actionable next steps, and instantly copyable curl commands with typed request/response contracts for integrating x402 micropayments.',
      endpoint: '/api/paid/developer',
      method: 'POST',
      priceUsd: config.PRICE_DEVELOPER_BIOSCOPE,
      previewPrompt: 'Query: x402 Express Middleware Integration',
      previewSample: '{"topic": "x402 TypeScript Integration", "explanation": "x402 integrates seamlessly with Express and client fetch wrappers...", "codeSnippet": "app.use(paymentMiddleware(routes, resourceServer))"}',
      requiredFields: [
        {
          name: 'topic',
          type: 'string',
          required: true,
          description: 'Engineering pattern or x402 concept to generate'
        },
        {
          name: 'language',
          type: 'string',
          required: false,
          options: ['typescript', 'python', 'go', 'rust'],
          description: 'Target programming language'
        }
      ]
    }
  ];

  router.get('/experiences', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      count: experiences.length,
      mode: config.PAYMENT_MODE,
      isSimulated: config.PAYMENT_MODE === 'mock',
      network: config.X402_NETWORK,
      experiences
    });
  });

  return router;
}
