import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MockBanner } from './components/MockBanner';
import { Hero } from './components/Hero';
import { ExperienceCards } from './components/ExperienceCards';
import { HowItWorks } from './components/HowItWorks';
import { ApiPlayground } from './components/ApiPlayground';
import { ReceiptPanel } from './components/ReceiptPanel';
import { Footer } from './components/Footer';
import { HealthInfo, BioscopeExperience, PaymentSettlementReceipt } from './types';

export const App: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [experiences, setExperiences] = useState<BioscopeExperience[]>([]);
  const [receipts, setReceipts] = useState<PaymentSettlementReceipt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Poll health and experiences on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [healthRes, expRes] = await Promise.all([
          fetch(`${apiUrl}/api/health`).then((r) => r.json()).catch(() => null),
          fetch(`${apiUrl}/api/experiences`).then((r) => r.json()).catch(() => null)
        ]);

        if (isMounted) {
          if (healthRes && healthRes.status === 'ok') {
            setHealth(healthRes);
          }
          if (expRes && expRes.experiences) {
            setExperiences(expRes.experiences);
          }
        }
      } catch (err) {
        console.warn('Initial backend fetch warning:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    // Poll health status periodically
    const interval = setInterval(fetchData, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [apiUrl]);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddReceipt = (receipt: PaymentSettlementReceipt) => {
    setReceipts((prev) => [receipt, ...prev.slice(0, 9)]);
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      {/* Film grain overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* Header */}
      <Header health={health} onNavigate={handleNavigate} />

      {/* Explicit Mock Mode Banner */}
      <MockBanner isSimulated={health?.payment?.isSimulated ?? true} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onExploreClick={() => handleNavigate('experiences')}
          onPlaygroundClick={() => handleNavigate('playground')}
        />

        {/* Experience Chambers */}
        <ExperienceCards
          experiences={experiences.length > 0 ? experiences : [
            {
              id: 'city',
              title: 'City Bioscope',
              shortTagline: 'Unearth Secret Indian Heritage & Culinary Roots',
              description: 'Journey into curated cultural landscapes of historic Indian cities—from Nashik to Jaipur, Varanasi, Kochi, and Mumbai.',
              endpoint: '/api/paid/city',
              method: 'POST',
              priceUsd: '$0.001',
              previewPrompt: 'City: Nashik',
              previewSample: 'Nashik was named in the Ramayana where Lord Rama and Sita resided at Panchavati...',
              requiredFields: [{ name: 'city', type: 'string', required: true, description: 'Target City' }]
            },
            {
              id: 'explain',
              title: 'Explainer Bioscope',
              shortTagline: 'Crystalline Explanations for Frontier Protocols',
              description: 'Distilled breakdowns of complex cryptographic and distributed systems concepts.',
              endpoint: '/api/paid/explain',
              method: 'POST',
              priceUsd: '$0.002',
              previewPrompt: 'Topic: x402 Protocol',
              previewSample: 'x402 operationalizes HTTP 402 for native micropayments...',
              requiredFields: [{ name: 'topic', type: 'string', required: true, description: 'Topic' }]
            },
            {
              id: 'developer',
              title: 'Developer Bioscope',
              shortTagline: 'Copyable API Contracts & x402 Implementation Blueprints',
              description: 'Engineered for Web3 builders: get architectural blueprints and copyable cURL contracts.',
              endpoint: '/api/paid/developer',
              method: 'POST',
              priceUsd: '$0.001',
              previewPrompt: 'x402 Middleware Pattern',
              previewSample: 'app.use(paymentMiddleware(routes, resourceServer));',
              requiredFields: [{ name: 'topic', type: 'string', required: true, description: 'Pattern' }]
            }
          ]}
          apiUrl={apiUrl}
          onReceiptGenerated={handleAddReceipt}
        />

        {/* How x402 Works */}
        <HowItWorks />

        {/* Interactive API Playground */}
        <ApiPlayground apiUrl={apiUrl} />

        {/* Verified Receipts Panel */}
        <ReceiptPanel receipts={receipts} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
