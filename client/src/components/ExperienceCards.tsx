import React, { useState } from 'react';
import { BioscopeExperience, PaymentSettlementReceipt } from '../types';
import { Sparkles, Compass, Lightbulb, Code2, Eye, Lock, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface ExperienceCardsProps {
  experiences: BioscopeExperience[];
  apiUrl: string;
  onReceiptGenerated: (receipt: PaymentSettlementReceipt) => void;
}

export const ExperienceCards: React.FC<ExperienceCardsProps> = ({ experiences, apiUrl, onReceiptGenerated }) => {
  const [activeExperience, setActiveExperience] = useState<string>('city');
  
  // Form input states
  const [selectedCity, setSelectedCity] = useState<string>('Nashik');
  const [cityInterests, setCityInterests] = useState<string>('vineyards, temples, culinary');
  
  const [explainTopic, setExplainTopic] = useState<string>('x402 Protocol');
  const [explainDifficulty, setExplainDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const [developerTopic, setDeveloperTopic] = useState<string>('x402 Express Middleware');
  const [developerLanguage, setDeveloperLanguage] = useState<string>('typescript');

  // Request & Unlock states
  const [statusStep, setStatusStep] = useState<'idle' | 'requesting' | 'challenging' | 'authorizing' | 'settling' | 'fulfilled' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unlockedData, setUnlockedData] = useState<any>(null);
  const [activeReceipt, setActiveReceipt] = useState<PaymentSettlementReceipt | null>(null);

  const handleUnlock = async (exp: BioscopeExperience) => {
    setStatusStep('requesting');
    setErrorMessage(null);
    setUnlockedData(null);
    setActiveReceipt(null);

    let payload: Record<string, unknown> = {};
    if (exp.id === 'city') {
      payload = {
        city: selectedCity,
        interests: cityInterests.split(',').map((s) => s.trim()).filter(Boolean)
      };
    } else if (exp.id === 'explain') {
      payload = {
        topic: explainTopic,
        difficulty: explainDifficulty
      };
    } else if (exp.id === 'developer') {
      payload = {
        topic: developerTopic,
        language: developerLanguage
      };
    }

    try {
      // Step 1: Initial unpaid call triggering HTTP 402 challenge
      setStatusStep('challenging');
      await new Promise((r) => setTimeout(r, 450)); // Visual pacing

      const unpaidRes = await fetch(`${apiUrl}${exp.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (unpaidRes.status !== 402 && !unpaidRes.ok) {
        throw new Error(`Server returned status ${unpaidRes.status}`);
      }

      // Step 2: Client receives 402 challenge, signs authorization
      setStatusStep('authorizing');
      await new Promise((r) => setTimeout(r, 600));

      // Generate payment signature
      const clientAuthSignature = `mock-sig-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // Step 3: Server verifies with facilitator and settles
      setStatusStep('settling');
      await new Promise((r) => setTimeout(r, 700));

      const paidRes = await fetch(`${apiUrl}${exp.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PAYMENT-SIGNATURE': clientAuthSignature
        },
        body: JSON.stringify(payload)
      });

      if (!paidRes.ok) {
        const errJson = await paidRes.json().catch(() => ({}));
        throw new Error(errJson.message || `Payment settlement failed with status ${paidRes.status}`);
      }

      const result = await paidRes.json();
      setUnlockedData(result.data);

      // Extract settlement receipt
      const rawHeader = paidRes.headers.get('PAYMENT-RESPONSE');
      let receipt: PaymentSettlementReceipt;
      if (rawHeader) {
        try {
          receipt = JSON.parse(atob(rawHeader));
        } catch {
          receipt = result.settlement;
        }
      } else {
        receipt = result.settlement;
      }

      setActiveReceipt(receipt);
      onReceiptGenerated(receipt);
      setStatusStep('fulfilled');
    } catch (err: any) {
      console.error('Unlock error:', err);
      setErrorMessage(err.message || 'Payment or network error occurred.');
      setStatusStep('error');
    }
  };

  const getIconForExp = (id: string) => {
    switch (id) {
      case 'city': return <Compass className="w-5 h-5 text-[#fcd34d]" />;
      case 'explain': return <Lightbulb className="w-5 h-5 text-[#fcd34d]" />;
      case 'developer': return <Code2 className="w-5 h-5 text-[#fcd34d]" />;
      default: return <Sparkles className="w-5 h-5 text-[#fcd34d]" />;
    }
  };

  return (
    <section id="experiences" className="py-16 sm:py-24 border-t border-[#181c2b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#181c2b] border border-[#2d3349] text-xs text-[#fcd34d] mb-4">
            <Eye className="w-3.5 h-3.5 text-[#e5a93c]" />
            <span className="font-mono tracking-wide">EXPERIENCE CATALOG</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#f5f0e6] mb-4">
            Curated Bioscope Chambers
          </h2>
          <p className="text-sm sm:text-base text-[#94a3b8]">
            Each chamber holds specialized intelligence unlocked on-demand through an individual x402 micropayment. Choose an experience below.
          </p>
        </div>

        {/* Experience Selector Tabs / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {experiences.map((exp) => {
            const isSelected = activeExperience === exp.id;
            return (
              <div
                key={exp.id}
                onClick={() => {
                  setActiveExperience(exp.id);
                  setStatusStep('idle');
                  setUnlockedData(null);
                  setActiveReceipt(null);
                  setErrorMessage(null);
                }}
                className={`cursor-pointer rounded-2xl p-6 transition-all border ${
                  isSelected
                    ? 'bg-[#141724] border-[#e5a93c]/60 shadow-[0_0_20px_rgba(229,169,60,0.15)] ring-1 ring-[#e5a93c]/40'
                    : 'bg-[#0e1018]/90 border-[#1f2436] hover:border-[#2f3750] hover:bg-[#121420]'
                }`}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#e5a93c]/10 border border-[#e5a93c]/30 flex items-center justify-center">
                    {getIconForExp(exp.id)}
                  </div>
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#1e2336] text-xs font-mono font-semibold text-[#fcd34d] border border-[#2d344d]">
                    <span>{exp.priceUsd}</span>
                    <span className="text-[10px] text-[#94a3b8]">/ call</span>
                  </div>
                </div>

                <h3 className="font-cinzel text-xl font-bold text-[#f5f0e6] mb-1">
                  {exp.title}
                </h3>
                <p className="text-xs text-[#e5a93c] font-medium mb-3">
                  {exp.shortTagline}
                </p>
                <p className="text-xs text-[#94a3b8] leading-relaxed line-clamp-3">
                  {exp.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Active Chamber Interactive Stage */}
        {(() => {
          const currentExp = experiences.find((e) => e.id === activeExperience) || experiences[0];
          if (!currentExp) return null;

          return (
            <div className="rounded-3xl bg-[#0d0f17] border border-[#23293d] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              
              {/* Subtle lens glow in chamber */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#e5a93c]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Panel: Configuration & Parameters */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-[#e5a93c] mb-2 uppercase tracking-wider">
                      <span>Viewing Lens Chamber</span>
                      <span>&bull;</span>
                      <span>Endpoint: {currentExp.endpoint}</span>
                    </div>
                    <h3 className="font-cinzel text-2xl font-bold text-[#f5f0e6]">
                      {currentExp.title}
                    </h3>
                    <p className="text-xs text-[#94a3b8] mt-1.5 leading-relaxed">
                      {currentExp.description}
                    </p>
                  </div>

                  {/* Dynamic Form Inputs */}
                  <div className="space-y-4 pt-2">
                    {currentExp.id === 'city' && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-[#cbd5e1] mb-2 uppercase tracking-wider">
                            Choose City:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Nashik', 'Jaipur', 'Varanasi', 'Kochi', 'Mumbai'].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setSelectedCity(c)}
                                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                                  selectedCity === c
                                    ? 'bg-[#e5a93c]/20 border-[#e5a93c] text-[#fcd34d]'
                                    : 'bg-[#131622] border-[#252c40] text-[#94a3b8] hover:border-[#384260]'
                                }`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#cbd5e1] mb-2 uppercase tracking-wider">
                            Interests / Focus (comma-separated):
                          </label>
                          <input
                            type="text"
                            value={cityInterests}
                            onChange={(e) => setCityInterests(e.target.value)}
                            placeholder="vineyards, temples, culinary, heritage"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#131622] border border-[#252c40] text-xs text-[#f5f0e6] placeholder-[#64748b] focus:outline-none focus:border-[#e5a93c] transition-colors"
                          />
                        </div>
                      </>
                    )}

                    {currentExp.id === 'explain' && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-[#cbd5e1] mb-2 uppercase tracking-wider">
                            Topic or Protocol:
                          </label>
                          <input
                            type="text"
                            value={explainTopic}
                            onChange={(e) => setExplainTopic(e.target.value)}
                            placeholder="e.g. x402 Protocol, Zero-Knowledge Proofs, EIP-712"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#131622] border border-[#252c40] text-xs text-[#f5f0e6] placeholder-[#64748b] focus:outline-none focus:border-[#e5a93c] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#cbd5e1] mb-2 uppercase tracking-wider">
                            Complexity Level:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                              <button
                                key={diff}
                                type="button"
                                onClick={() => setExplainDifficulty(diff)}
                                className={`px-3 py-2 rounded-xl text-xs capitalize font-medium border transition-all ${
                                  explainDifficulty === diff
                                    ? 'bg-[#e5a93c]/20 border-[#e5a93c] text-[#fcd34d]'
                                    : 'bg-[#131622] border-[#252c40] text-[#94a3b8] hover:border-[#384260]'
                                }`}
                              >
                                {diff}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {currentExp.id === 'developer' && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-[#cbd5e1] mb-2 uppercase tracking-wider">
                            Developer Pattern:
                          </label>
                          <input
                            type="text"
                            value={developerTopic}
                            onChange={(e) => setDeveloperTopic(e.target.value)}
                            placeholder="e.g. x402 Express Middleware, Viem Fetch Wrapper"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#131622] border border-[#252c40] text-xs text-[#f5f0e6] placeholder-[#64748b] focus:outline-none focus:border-[#e5a93c] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#cbd5e1] mb-2 uppercase tracking-wider">
                            Language:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {['typescript', 'python', 'go'].map((lang) => (
                              <button
                                key={lang}
                                type="button"
                                onClick={() => setDeveloperLanguage(lang)}
                                className={`px-3 py-2 rounded-xl text-xs uppercase font-medium border transition-all ${
                                  developerLanguage === lang
                                    ? 'bg-[#e5a93c]/20 border-[#e5a93c] text-[#fcd34d]'
                                    : 'bg-[#131622] border-[#252c40] text-[#94a3b8] hover:border-[#384260]'
                                }`}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Unlock Action Button */}
                  <div className="pt-4">
                    <button
                      onClick={() => handleUnlock(currentExp)}
                      disabled={statusStep !== 'idle' && statusStep !== 'fulfilled' && statusStep !== 'error'}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d97706] via-[#e5a93c] to-[#f59e0b] text-[#07080c] font-bold text-sm tracking-wide shadow-lg shadow-[#d97706]/25 hover:shadow-[#e5a93c]/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center space-x-2.5"
                    >
                      {statusStep === 'idle' || statusStep === 'fulfilled' || statusStep === 'error' ? (
                        <>
                          <Lock className="w-4 h-4 text-[#07080c]" />
                          <span>Unlock Insight for {currentExp.priceUsd}</span>
                        </>
                      ) : (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#07080c]" />
                          <span className="capitalize">{statusStep}...</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-[#94a3b8] mt-2 font-mono">
                      Stateless &bull; Single HTTP 402 challenge-settlement call
                    </p>
                  </div>

                  {/* Real-time Flow Tracker */}
                  {statusStep !== 'idle' && (
                    <div className="p-4 rounded-xl bg-[#141724] border border-[#252c40] text-xs font-mono space-y-2">
                      <div className="text-[11px] font-semibold text-[#fcd34d] uppercase tracking-wider mb-1">
                        x402 Protocol Exchange:
                      </div>
                      <div className={`flex items-center space-x-2 ${statusStep === 'challenging' ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${statusStep === 'challenging' ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`} />
                        <span>1. Request sent &rarr; HTTP 402 challenge received</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${statusStep === 'authorizing' ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${statusStep === 'authorizing' ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`} />
                        <span>2. Signing EIP-712 payment authorization</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${statusStep === 'settling' ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${statusStep === 'settling' ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`} />
                        <span>3. Facilitator verification & on-chain settlement</span>
                      </div>
                      {statusStep === 'fulfilled' && (
                        <div className="flex items-center space-x-2 text-emerald-400 font-bold pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>4. Settlement confirmed! Resource delivered (200 OK)</span>
                        </div>
                      )}
                      {statusStep === 'error' && (
                        <div className="flex items-center space-x-2 text-rose-400 font-bold pt-1">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Error: {errorMessage}</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Right Panel: Viewing Glass / Delivered Content */}
                <div className="lg:col-span-7 bg-[#11141f] rounded-2xl border border-[#232a3d] p-6 min-h-[460px] flex flex-col justify-between">
                  
                  {unlockedData ? (
                    <div className="space-y-6">
                      
                      {/* Notice & Status Ribbon */}
                      <div className="flex items-center justify-between pb-4 border-b border-[#212738]">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                          <span className="text-xs font-mono font-semibold text-emerald-400 tracking-wider">
                            HTTP 200 DELIVERED
                          </span>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-[#1e2336] text-[#fcd34d] border border-[#2d344d]">
                          {unlockedData.contentNotice || unlockedData.executionMode || 'UNLOCKED'}
                        </span>
                      </div>

                      {/* City Bioscope Result Display */}
                      {currentExp.id === 'city' && (
                        <div className="space-y-5 text-left">
                          <div>
                            <h4 className="font-cinzel text-2xl font-bold text-[#f5f0e6]">
                              {unlockedData.city}
                            </h4>
                            <p className="text-xs text-[#e5a93c] italic font-medium mt-1">
                              {unlockedData.tagline}
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-[#161a29] border border-[#252c40] text-xs text-[#cbd5e1] leading-relaxed">
                            {unlockedData.historicalContext}
                          </div>

                          <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
                              Signature Highlights:
                            </h5>
                            <ul className="space-y-1.5 text-xs text-[#f1f5f9]">
                              {unlockedData.highlights?.map((h: string, i: number) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <span className="text-[#e5a93c]">&bull;</span>
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {unlockedData.shortItinerary && (
                            <div>
                              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
                                Curated Itinerary:
                              </h5>
                              <div className="space-y-3">
                                {unlockedData.shortItinerary.map((day: any, i: number) => (
                                  <div key={i} className="p-3 rounded-lg bg-[#141724] border border-[#202738] text-xs">
                                    <div className="font-semibold text-[#fcd34d] mb-1">{day.day}</div>
                                    <ul className="space-y-1 text-[#94a3b8]">
                                      {day.activities?.map((act: string, j: number) => (
                                        <li key={j}>- {act}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {unlockedData.culinaryDelights && (
                            <div className="p-3.5 rounded-xl bg-[#191d2e] border border-[#273046]">
                              <span className="text-xs font-semibold text-[#fcd34d] uppercase tracking-wider">
                                Culinary Pairings:
                              </span>
                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {unlockedData.culinaryDelights.map((dish: string, i: number) => (
                                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-[#121420] text-[#e2e8f0] border border-[#2e374f]">
                                    {dish}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Explainer Bioscope Result Display */}
                      {currentExp.id === 'explain' && (
                        <div className="space-y-5 text-left">
                          <div>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1e2336] text-[#e5a93c] border border-[#2d344d]">
                              Difficulty: {unlockedData.difficulty}
                            </span>
                            <h4 className="font-cinzel text-2xl font-bold text-[#f5f0e6] mt-2">
                              {unlockedData.topic}
                            </h4>
                          </div>

                          <div className="p-4 rounded-xl bg-[#161a29] border border-[#252c40] text-xs text-[#e2e8f0] leading-relaxed">
                            <span className="font-semibold text-[#fcd34d] block mb-1">Core Summary:</span>
                            {unlockedData.summary}
                          </div>

                          <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
                              Mechanisms & Key Points:
                            </h5>
                            <ul className="space-y-2 text-xs text-[#cbd5e1]">
                              {unlockedData.keyPoints?.map((p: string, i: number) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <span className="text-[#e5a93c] font-bold">{i + 1}.</span>
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3.5 rounded-xl bg-[#191d2e] border border-[#273046]">
                            <span className="text-xs font-semibold text-[#fcd34d] block mb-1">
                              Concrete Mental Model / Example:
                            </span>
                            <p className="text-xs text-[#cbd5e1] leading-relaxed italic">
                              "{unlockedData.concreteExample}"
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-[#141724] border border-[#e5a93c]/30 text-xs text-[#fcd34d]">
                            <span className="font-bold block mb-0.5">Key Takeaway:</span>
                            {unlockedData.keyTakeaway}
                          </div>
                        </div>
                      )}

                      {/* Developer Bioscope Result Display */}
                      {currentExp.id === 'developer' && (
                        <div className="space-y-5 text-left font-sans">
                          <div>
                            <h4 className="font-cinzel text-2xl font-bold text-[#f5f0e6]">
                              {unlockedData.topic}
                            </h4>
                            <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                              {unlockedData.explanation}
                            </p>
                          </div>

                          <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
                              Core Architecture Concepts:
                            </h5>
                            <div className="flex flex-wrap gap-1.5">
                              {unlockedData.concepts?.map((c: string, i: number) => (
                                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[#161a29] text-[#fcd34d] border border-[#252c40]">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                              Implementation Blueprint:
                            </h5>
                            <pre className="p-4 rounded-xl bg-[#090a0f] border border-[#202636] font-mono text-[11px] text-[#38bdf8] overflow-x-auto leading-relaxed">
                              {unlockedData.codeSnippet}
                            </pre>
                          </div>

                          {unlockedData.copyableApiExample && (
                            <div>
                              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                                Copyable Verified cURL Request:
                              </h5>
                              <pre className="p-3 rounded-xl bg-[#090a0f] border border-[#202636] font-mono text-[11px] text-[#a7f3d0] overflow-x-auto">
                                {unlockedData.copyableApiExample.curl}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  ) : (
                    /* Default Preview / Locked State */
                    <div className="my-auto text-center py-12 px-4 space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#161926] border border-[#2b3248] flex items-center justify-center mx-auto text-[#e5a93c]/50">
                        <Lock className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-cinzel text-xl font-bold text-[#e2e8f0]">
                          Awaiting Micropayment Authorization
                        </h4>
                        <p className="text-xs text-[#94a3b8] max-w-md mx-auto mt-1 leading-relaxed">
                          This insight is protected by x402 HTTP paywall. Hit "Unlock Insight" on the left to initiate the 402 challenge and settle via the protocol.
                        </p>
                      </div>

                      {/* Sample preview box */}
                      <div className="p-4 rounded-xl bg-[#0a0c12] border border-[#1f2538] text-left max-w-lg mx-auto">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#e5a93c] block mb-1">
                          Preview Snippet:
                        </span>
                        <p className="text-xs text-[#64748b] italic leading-relaxed">
                          "{currentExp.previewSample}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Settlement Receipt Footer */}
                  {activeReceipt && (
                    <div className="mt-6 pt-4 border-t border-[#1f2538] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#94a3b8]">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Settled: {activeReceipt.amount} on {activeReceipt.network}</span>
                      </div>
                      <div className="text-[11px] text-[#e5a93c]">
                        {activeReceipt.isSimulated ? (
                          'SIMULATED PAYMENT — NO FUNDS TRANSFERRED'
                        ) : activeReceipt.transactionHash ? (
                          <a
                            href={activeReceipt.blockExplorerUrl || `https://sepolia.basescan.org/tx/${activeReceipt.transactionHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-[#fcd34d]"
                          >
                            View on BaseScan &rarr;
                          </a>
                        ) : (
                          'Settled on Testnet'
                        )}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
};
