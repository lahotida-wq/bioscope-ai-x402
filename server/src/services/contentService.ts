import { CityInsight, ExplainerInsight, DeveloperInsight } from '../types.js';
import { AppConfig } from '../config.js';

const CITY_DATABASE: Record<string, Omit<CityInsight, 'contentNotice'>> = {
  nashik: {
    city: 'Nashik',
    tagline: 'The Ancient Wine Capital & Spiritual Hearth of the Godavari',
    historicalContext: 'Dating back to the Epic Ramayana where Lord Rama spent years in exile at Panchavati, Nashik has evolved into India\'s burgeoning viticulture capital while retaining ancient sacred rituals.',
    highlights: [
      'Panchavati & Sita Gufaa - The mythological heart of the Ramayana exile',
      'Trimbakeshwar Shiva Jyotirlinga - Ancient black stone temple at the source of Godavari River',
      'Sula, Grover Zampa & York Vineyards - Rolling hills producing India’s finest Chenin Blanc and Shiraz',
      'Pandavleni Caves - 2nd century BCE Buddhist rock-cut monasteries overlooking the valley',
      'Ramkund Ghat - Sacred waters where the Maha Kumbh Mela unfolds every twelve years'
    ],
    hiddenGems: [
      'Anjaneri Fort - Mythological birthplace of Lord Hanuman, offering misty ridge treks',
      'Gargoti Mineral Museum - World-renowned private collection of rare zeolites and crystals',
      'Artisanal Misal at Sadhana Chulivarchi - Slow-cooked spiced lentil stew over firewood with earthen bowls'
    ],
    shortItinerary: [
      {
        day: 'Day 1: Spiritual Roots & Ancient Trails',
        activities: [
          'Sunrise aarti and sacred walk across Ramkund Ghats',
          'Explore Panchavati temple quarter and ancient banyan grove',
          'Afternoon hike up the 300 steps of Pandavleni Buddhist rock complex',
          'Sunset dinner sampling iconic Nashik Misal Pav and fresh jalebi'
        ]
      },
      {
        day: 'Day 2: Vineyards & Trimbak Foothills',
        activities: [
          'Morning journey to Trimbakeshwar in the shadow of Brahmagiri hills',
          'Afternoon vineyard tour, barrel-room tasting, and vineyard bistro lunch',
          'Golden hour walk along the backwaters of Gangapur Dam'
        ]
      }
    ],
    travelTips: [
      'Visit between October and March for cool breezy mornings and vineyard pruning season.',
      'Auto-rickshaws are plentiful; agree on fare beforehand or use metered counters at the central station.',
      'Dress modestly when visiting temple sanctums in Trimbakeshwar and Ramkund.'
    ],
    bestSeason: 'October to March (Winter & Harvest)',
    culinaryDelights: [
      'Authentic Nashik Chulivarchi Misal with rassa and curd',
      'Kondaji Chivda (century-old spiced beaten rice snack)',
      'Locally bottled artisanal Reserve Shiraz pairing'
    ]
  },
  jaipur: {
    city: 'Jaipur',
    tagline: 'The Pink Citadel of Astronomers, Gem Cutters, and Royal Valor',
    historicalContext: 'Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur was India\'s first planned city built on Vastu Shastra principles, painted terracotta pink in 1876 to welcome the Prince of Wales.',
    highlights: [
      'Hawa Mahal (Palace of Winds) - 953 honeycomb sandstone casements built for royal women',
      'Amer Fort & Sheesh Mahal - Majestic hilltop fortress adorned with mirror mosaics',
      'Jantar Mantar - UNESCO World Heritage open-air astronomical observatory with stone sundials',
      'City Palace & Chandra Mahal - Living royal residence housing exquisite Rajput & Mughal textiles',
      'Nahargarh Fort - Perched high above the Aravalli hills for panoramic city panoramas'
    ],
    hiddenGems: [
      'Panna Meena ka Kund - Geometric stepwell near Amer with mesmerizing stair symmetry',
      'Galtaji (The Monkey Temple) - Natural freshwater springs nestled in a mountain gorge',
      'Block printing ateliers of Bagru - Traditional mud-resist (Dabu) textile dyeing'
    ],
    shortItinerary: [
      {
        day: 'Day 1: Fortresses of the Aravalli',
        activities: [
          'Early ascent to Amer Fort before crowds arrive',
          'Quiet pause at Panna Meena stepwell',
          'Late afternoon visit to Nahargarh Fort for sunset over the Pink City',
          'Traditional Rajasthani Thali dinner in the historic old quarters'
        ]
      },
      {
        day: 'Day 2: Royal Astronomy & Artisan Bazaars',
        activities: [
          'Morning photo stop at Hawa Mahal facade in soft dawn light',
          'Tour the astronomical wonders of Jantar Mantar and City Palace',
          'Bespoke gemstone and block-print shopping in Johari and Bapu Bazaars'
        ]
      }
    ],
    travelTips: [
      'Purchase the Composite Ticket for Amer, Hawa Mahal, Jantar Mantar and Nahargarh to save time.',
      'Bargaining in traditional bazaars is expected and respectful if done with good humor.',
      'Wear slip-on shoes since many historical precincts and courtyards require shoe removal.'
    ],
    bestSeason: 'November to February (Pleasant winter sunshine)',
    culinaryDelights: [
      'Dal Baati Churma with generous desi ghee',
      'Mawa Kachori from century-old Rawat Mishthan Bhandar',
      'Kulhad Lassi on MI Road topped with thick clotted malai'
    ]
  },
  varanasi: {
    city: 'Varanasi',
    tagline: 'Kashi — The Eternal City of Light on the Sacred Crescent of Ganga',
    historicalContext: 'One of the world\'s continuously inhabited cities for over 3,000 years, Varanasi represents the spiritual epicenter of Hinduism, where life, mortality, and transcendence converge on sacred riverbanks.',
    highlights: [
      'Dashashwamedh Ghat Ganga Aarti - Spellbinding nightly choreographed prayer with brass lamps',
      'Kashi Vishwanath Corridor - Radiant golden-spired shrine dedicated to Lord Shiva',
      'Sunrise Boat Voyage - Gliding past 84 stone ghats from Assi to Manikarnika in early mist',
      'Sarnath Deer Park - Where Gautama Buddha preached his first sermon after enlightenment',
      'Manikarnika & Harishchandra Ghats - Sacred eternal flames of cremation and liberation (Moksha)'
    ],
    hiddenGems: [
      'Varanasi Silk Weavers\' Quarter (Madanpura) - Intricate Zari handloom silk sarees in narrow gallis',
      'Lolark Kund - Ancient subterranean stepwell dedicated to the Sun God',
      'Morning Classical Ragas at Subah-e-Banaras at Assi Ghat'
    ],
    shortItinerary: [
      {
        day: 'Day 1: The Sacred Riverfront',
        activities: [
          '5:30 AM rowboat along the crescent of Ganga watching morning rituals',
          'Wander the labyrinthine gallis of Old Kashi and Vishwanath Gali',
          'Rest midday with chilled Thandai and Malaiyo dessert',
          'Evening front-row boat view of the Grand Dashashwamedh Aarti'
        ]
      },
      {
        day: 'Day 2: Buddhist Dawn & Classical Heritage',
        activities: [
          'Morning excursion to peaceful stupas and monastery ruins of Sarnath',
          'Afternoon exploration of Bharat Kala Bhavan museum at BHU campus',
          'Evening listening to classical Shehnai or Sitar recital in a heritage Haveli'
        ]
      }
    ],
    travelTips: [
      'Navigate the old town on foot; cars cannot enter the narrow historic gallis.',
      'Show profound respect at cremation ghats: strictly avoid photography or loud behavior.',
      'Pre-negotiate manual wooden boat rides rather than motorized noisy vessels for the dawn trip.'
    ],
    bestSeason: 'October to March (Crisp morning air and river breezes)',
    culinaryDelights: [
      'Kachori Jalebi breakfast served on sal-leaf plates',
      'Varanasi Paan prepared with gulkand and silver foil',
      'Winter Malaiyo (frothy saffron milk foam served in clay pots)'
    ]
  },
  kochi: {
    city: 'Kochi',
    tagline: 'The Queen of the Arabian Sea: Spice Ports, Chinese Nets & Synagogues',
    historicalContext: 'For over six centuries, Fort Kochi welcomed Arab dhows, Chinese traders, Portuguese explorers, Dutch merchants, and British colonizers, forging a tranquil tropical melting pot.',
    highlights: [
      'Cheena Vala - Iconic cantilevered Chinese fishing nets silhouetted against sea sunsets',
      'Mattancherry Palace (Dutch Palace) - Exquisite mythological Kerala mural frescoes',
      'Paradesi Synagogue & Jew Town - 1568 heritage sanctuary with hand-painted Cantonese willow tiles',
      'Fort Kochi Colonial Heritage Walk - St. Francis Church where Vasco da Gama was first buried',
      'Kathakali Performance - Gripping classical temple dance-drama with intricate eye movements'
    ],
    hiddenGems: [
      'Kochi-Muziris Biennale Pavilions - Historic warehouses transformed into cutting-edge contemporary art',
      'Ginger House Museum Restaurant - Antique maritime showroom overlooking backwater dhows',
      'Kumbalangi Integrated Tourism Village - Serene mangrove islands and traditional crab farming'
    ],
    shortItinerary: [
      {
        day: 'Day 1: Colonial Alleys & Coastal Heritage',
        activities: [
          'Morning stroll beneath giant rain trees along Princess Street in Fort Kochi',
          'Watch fishermen operate the counterbalanced Chinese fishing nets',
          'Afternoon visit to Jew Town spice warehouses and Paradesi Synagogue',
          'Evening Kathakali makeup viewing followed by live dramatic performance'
        ]
      },
      {
        day: 'Day 2: Backwater Waterways & Contemporary Art',
        activities: [
          'Hop on the local Ro-Ro ferry across the harbor to Vypeen Island',
          'Explore modern installations at heritage Aspinwall House',
          'Sunset seafood feast featuring Karimeen Pollichathu wrapped in banana leaf'
        ]
      }
    ],
    travelTips: [
      'Rent a bicycle to explore Fort Kochi and Mattancherry at a relaxed pace.',
      'Check dates if visiting during the Kochi-Muziris Biennale (held biennially during winter).',
      'Use the modern Kochi Water Metro for scenic, air-conditioned water transit across islands.'
    ],
    bestSeason: 'September to March (Pleasant tropical warmth)',
    culinaryDelights: [
      'Karimeen Pollichathu (Pearl spot fish braised in shallots and wrapped in banana leaves)',
      'Kerala Appam with rich coconut vegetable stew',
      'Fresh tender coconut water and filter coffee at beach shacks'
    ]
  },
  mumbai: {
    city: 'Mumbai',
    tagline: 'The Maximum City of Victorian Gothic Dreams, Sea Breezes & Relentless Energy',
    historicalContext: 'Constructed from seven volcanic islands merged by 19th-century land reclamation, Mumbai grew from an East India Company outpost into India’s financial and cinematic powerhouse.',
    highlights: [
      'Gateway of India & The Taj Mahal Palace Hotel - Grand basalt arch facing the Arabian harbor',
      'Chhatrapati Shivaji Maharaj Terminus (CST) - UNESCO Victorian Gothic gargoyles and vaulted arches',
      'Marine Drive (The Queen’s Necklace) - Sweeping 3km promenade illuminated by sodium lamps',
      'Elephanta Caves - 6th-century rock-cut Trimurti Shiva sculpture across Mumbai harbor',
      'Kala Ghoda Art Precinct - Vibrant cafe culture, indie boutiques, and historic synagogues'
    ],
    hiddenGems: [
      'Banganga Tank in Walkeshwar - Quiet 12th-century freshwater stepwell surrounded by temples',
      'Khotachiwadi - 19th-century Portuguese-style wooden heritage enclave in Girgaon',
      'Sassoon Docks at dawn - Roaring fish auctions of the native Koli seafaring community'
    ],
    shortItinerary: [
      {
        day: 'Day 1: Colonial Architecture & Harbor Lore',
        activities: [
          'Morning walk past Victorian Gothic monuments of Fort and Kala Ghoda',
          'Afternoon heritage high tea at the Taj Mahal Palace Hotel',
          'Sunset walk along the promenade of Marine Drive as the lights sparkle',
          'Dinner of Parsi Berry Pulao at historic Britannia & Co.'
        ]
      },
      {
        day: 'Day 2: Coastal Enclaves & Modern Vibrance',
        activities: [
          'Early harbor catamaran to the ancient rock sculptures of Elephanta Island',
          'Afternoon exploration of Bandra’s graffiti lanes, heritage cottages, and sea-facing cafes',
          'Evening Pav Bhaji and Kulfi at Chowpatty Beach under the night sky'
        ]
      }
    ],
    travelTips: [
      'Experience the Mumbai Suburban Railway during non-peak hours (11:30 AM - 3:30 PM).',
      'Black and yellow (Kaali Peeli) cabs run on strict digital meters; no negotiation required.',
      'Carry light cottons year-round; the coastal humidity is constant.'
    ],
    bestSeason: 'November to February (Cooler sea breezes)',
    culinaryDelights: [
      'Authentic Mumbai Vada Pav with dry garlic chutney',
      'Parsi Sali Boti and Mutton Berry Pulao',
      'Irani Bun Maska dunked in steaming sweet cutting chai'
    ]
  }
};

export class ContentService {
  constructor(private config: AppConfig) {}

  public getCityInsight(cityName: string, interests?: string[]): CityInsight {
    const normalizedKey = cityName.trim().toLowerCase();
    const cityData = CITY_DATABASE[normalizedKey];

    if (cityData) {
      let filteredHighlights = cityData.highlights;
      if (interests && interests.length > 0) {
        const lowerInterests = interests.map((i) => i.toLowerCase());
        const matched = cityData.highlights.filter((h) =>
          lowerInterests.some((interest) => h.toLowerCase().includes(interest))
        );
        if (matched.length > 0) {
          filteredHighlights = matched;
        }
      }

      return {
        ...cityData,
        highlights: filteredHighlights,
        contentNotice: 'SAMPLE CONTENT'
      };
    }

    // Curated fallback for any other requested Indian city
    const capitalized = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    return {
      city: capitalized,
      tagline: `Cultural Crossroads & Heritage Discovery of ${capitalized}`,
      historicalContext: `${capitalized} embodies the rich regional tapestry of India, where historic trade routes and architectural wonders intertwine with modern community spirit.`,
      highlights: [
        `Historic Old Quarter & Heritage Monuments of ${capitalized}`,
        `Local artisanal craft bazaars and traditional street ateliers`,
        `Scenic riverfront or hilltop viewpoints overlooking the city skyline`,
        `Regional temple and culinary heritage centers`
      ],
      hiddenGems: [
        `Ancient community water reservoir / stepwell on the city outskirts`,
        `Heritage family kitchen serving multi-generational specialty recipes`,
        `Sunrise vantage point celebrated by local artists and poets`
      ],
      shortItinerary: [
        {
          day: 'Day 1: Heritage & Old Town Exploration',
          activities: [
            `Morning walking tour through the oldest historic neighborhoods of ${capitalized}`,
            'Midday tasting of regional snacks and seasonal beverages',
            'Sunset viewpoint visit followed by traditional dinner'
          ]
        },
        {
          day: 'Day 2: Artisans & Hidden Sanctuaries',
          activities: [
            'Visit to regional textile or handicraft workshops',
            'Afternoon stroll through botanical gardens or sacred courtyards',
            'Evening stroll along vibrant market bazaars'
          ]
        }
      ],
      travelTips: [
        'Explore early in the morning for cooler temperatures and tranquil photography.',
        'Support local artisans by purchasing handcrafted goods directly from workshops.',
        'Sample local street delicacies from busy stalls with high daily turnover.'
      ],
      bestSeason: 'October to March',
      culinaryDelights: [
        `Signature regional curry of ${capitalized}`,
        'Freshly steamed breakfast savory snacks',
        'Traditional sweetened milk confectionery'
      ],
      contentNotice: 'SAMPLE CONTENT'
    };
  }

  public async getExplainerInsight(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ): Promise<ExplainerInsight> {
    const cleanTopic = topic.trim();

    // Check if live AI provider is configured with valid API key
    if (this.config.OPENAI_API_KEY && this.config.OPENAI_API_KEY.startsWith('sk-')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.AI_TIMEOUT_MS);

        const prompt = `Explain the following topic with precision and clarity for a ${difficulty} audience.
Topic: "${cleanTopic}"
Respond ONLY with a valid JSON object matching this schema:
{
  "summary": "1-2 sentence core definition",
  "keyPoints": ["3-4 bullet points detailing mechanisms and significance"],
  "concreteExample": "1 real-world, intuitive example or mental model",
  "keyTakeaway": "One memorable summarizing sentence"
}`;

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: this.config.AI_MODEL,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.3
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json() as { choices?: [{ message?: { content?: string } }] };
          const content = json.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content) as {
              summary: string;
              keyPoints: string[];
              concreteExample: string;
              keyTakeaway: string;
            };
            return {
              topic: cleanTopic,
              difficulty,
              summary: parsed.summary,
              keyPoints: parsed.keyPoints || [],
              concreteExample: parsed.concreteExample,
              keyTakeaway: parsed.keyTakeaway,
              executionMode: 'LIVE AI INFERENCE'
            };
          }
        }
      } catch (err) {
        // Fall back gracefully to deterministic demo
        console.warn(`[ContentService] AI inference fallback to deterministic response:`, (err as Error).message);
      }
    }

    // Deterministic high-quality responses for common or arbitrary topics
    return this.generateDeterministicExplainer(cleanTopic, difficulty);
  }

  private generateDeterministicExplainer(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): ExplainerInsight {
    const lower = topic.toLowerCase();

    if (lower.includes('x402') || lower.includes('http 402') || lower.includes('pay per call')) {
      return {
        topic: 'x402: The Web-Native Payment Standard',
        difficulty,
        summary: 'x402 operationalizes the reserved HTTP 402 Payment Required status code, standardizing how APIs challenge clients for micropayments and settle them directly over blockchain networks without subscriptions or accounts.',
        keyPoints: [
          'Stateless Pay-Per-Request: Clients request an endpoint; server returns 402 with structured requirements (network, asset, amount, facilitator).',
          'Cryptographic Authorization: Client wallet signs an EIP-712 payment authorization payload without exposing private keys.',
          'Facilitator Settlement: Server submits the signed payload to an x402 facilitator for instant verification and on-chain settlement before delivering payload.',
          'Decentralized Machine Economy: Enables autonomous AI agents and micro-services to purchase data and compute frictionlessly.'
        ],
        concreteExample: 'Imagine an ancient bioscope on wheels where you drop a 10-paise coin through a brass slot to see one slide: x402 is that exact digital coin slot for every HTTP GET and POST request on the internet.',
        keyTakeaway: 'x402 transforms the web from an ad-and-subscription walled garden into a frictionless, pay-per-call machine economy.',
        executionMode: 'DEMO IMPLEMENTATION'
      };
    }

    if (lower.includes('zero knowledge') || lower.includes('zkp') || lower.includes('zk-snark')) {
      return {
        topic: 'Zero-Knowledge Proofs (ZKPs)',
        difficulty,
        summary: 'A cryptographic method enabling one party (the prover) to prove to another (the verifier) that a specific statement is true without revealing any secret information beyond the statement\'s validity.',
        keyPoints: [
          'Completeness: If the statement is true and both parties are honest, the verifier will always be convinced.',
          'Soundness: A cheating prover cannot convince an honest verifier of a falsehood, except with negligible probability.',
          'Zero-Knowledge: The verifier learns nothing whatsoever about the secret witness, only that the mathematical relation holds.'
        ],
        concreteExample: 'Proving you know the secret password to enter Ali Baba’s circular cave by emerging from the requested exit tunnel every single time without ever uttering the password out loud.',
        keyTakeaway: 'Zero-knowledge proofs untie verification from surveillance, providing verifiable computation with absolute privacy.',
        executionMode: 'DEMO IMPLEMENTATION'
      };
    }

    // General high-quality deterministic response
    return {
      topic,
      difficulty,
      summary: `${topic} is a foundational concept structured around verifiable principles, modular architectural patterns, and systemic optimization.`,
      keyPoints: [
        `Core Primitive: Analyzes the trade-offs between speed, cost, and verification guarantees in modern systems.`,
        `Mechanism: Operates via deterministic state transitions verified by decentralized or cryptographically bound consensus.`,
        `Implementation: Emphasizes fault tolerance, idempotent operations, and minimal surface for unhandled exceptions.`
      ],
      concreteExample: `In a production pipeline, this operates like an automated airlock: each step verifies invariants before granting downstream execution rights.`,
      keyTakeaway: `Mastering ${topic} unlocks scalable, resilient software architectures designed for verifiable autonomy.`,
      executionMode: 'DEMO IMPLEMENTATION'
    };
  }

  public getDeveloperInsight(topic: string, language: string = 'typescript'): DeveloperInsight {
    const cleanTopic = topic.trim();
    const isX402 = cleanTopic.toLowerCase().includes('x402') || cleanTopic.toLowerCase().includes('pay');

    if (isX402) {
      return {
        topic: 'x402 TypeScript Integration Protocol',
        explanation: 'x402 integrates seamlessly with Node.js/Express on the server and modern fetch/viem on the client. When an unpaid client requests a protected route, the server responds with HTTP 402 containing payment requirements. The client wallet signs the requirement payload and retries with the PAYMENT-SIGNATURE header, which the server settles via an x402 facilitator before fulfilling the request.',
        concepts: [
          'HTTP 402 Challenge & Header Exchange',
          'EIP-712 Off-Chain Signature Authorization',
          'Facilitator-Mediated On-Chain Settlement (Base Sepolia)',
          'Idempotent Settlement Deduplication'
        ],
        nextSteps: [
          '1. Install @x402/core, @x402/express, and @x402/fetch',
          '2. Configure Express route payment middleware with network eip155:84532',
          '3. Wrap client fetch calls with wrapFetchWithPayment or use viem signer in Node',
          '4. Monitor facilitator response and extract transaction hashes from PAYMENT-RESPONSE'
        ],
        codeSnippet: `// Server: Protect an Express route with x402 middleware
import express from 'express';
import { paymentMiddleware, x402ResourceServer } from '@x402/express';
import { HTTPFacilitatorClient } from '@x402/core/server';
import { ExactEvmScheme } from '@x402/evm/exact/server';

const app = express();
const facilitator = new HTTPFacilitatorClient({ url: 'https://x402.org/facilitator' });
const resourceServer = new x402ResourceServer(facilitator)
  .register('eip155:84532', new ExactEvmScheme());

app.use(paymentMiddleware({
  'POST /api/paid/data': {
    accepts: [{
      scheme: 'exact',
      price: '$0.001',
      network: 'eip155:84532',
      payTo: '0xYourRecipientAddress'
    }],
    description: 'Bioscope Data Feed'
  }
}, resourceServer));`,
        copyableApiExample: {
          curl: `curl -X POST https://bioscope.example.com/api/paid/city \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <base64_encoded_eip712_signature>" \\
  -d '{"city":"Nashik"}'`,
          requestBody: { city: 'Nashik', interests: ['wine', 'temples'] },
          responseBody: {
            status: 200,
            city: 'Nashik',
            highlights: ['Panchavati', 'Sula Vineyards', 'Pandavleni Caves'],
            contentNotice: 'SAMPLE CONTENT',
            settlement: {
              success: true,
              network: 'eip155:84532',
              amount: '$0.001'
            }
          }
        },
        contentNotice: 'SAMPLE CONTENT'
      };
    }

    return {
      topic: cleanTopic,
      explanation: `Architectural specification and API implementation pattern for ${cleanTopic} targeting modern distributed runtimes.`,
      concepts: [
        'Deterministic State Transition',
        'Idempotent API Contract Design',
        'Fail-Fast Schema Enforcement with Zod',
        'Cryptographic Nonce and Replay Protection'
      ],
      nextSteps: [
        `1. Model strict input/output schemas for ${cleanTopic}`,
        '2. Add integration tests verifying 400 bad request, 402 unpaid challenge, and 200 success',
        '3. Implement rate-limiting and circuit breaker timeouts'
      ],
      codeSnippet: `// Idiomatic implementation for ${cleanTopic} in ${language}
export async function executeHandler(payload: Record<string, unknown>) {
  const verified = schema.parse(payload);
  const result = await computeInsight(verified);
  return { success: true, result, timestamp: new Date().toISOString() };
}`,
      copyableApiExample: {
        curl: `curl -X POST https://api.bioscope.ai/api/paid/developer \\
  -H "Content-Type: application/json" \\
  -d '{"topic":"${cleanTopic}"}'`,
        requestBody: { topic: cleanTopic, language },
        responseBody: {
          explanation: `Architectural breakdown of ${cleanTopic}`,
          concepts: ['Concept A', 'Concept B'],
          nextSteps: ['Step 1', 'Step 2']
        }
      },
      contentNotice: 'SAMPLE CONTENT'
    };
  }
}
