import React from 'react';
import { Send, FileCode2, KeyRound, CheckCircle, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Initial Resource Request',
      role: 'Client &rarr; Server',
      icon: <Send className="w-5 h-5 text-[#fcd34d]" />,
      description: 'The client requests a protected insight endpoint (e.g. POST /api/paid/city) without prior payment or account registration.'
    },
    {
      num: '02',
      title: 'HTTP 402 Challenge',
      role: 'Server &rarr; Client',
      icon: <FileCode2 className="w-5 h-5 text-[#fcd34d]" />,
      description: 'The server halts execution and returns HTTP 402 Payment Required with WWW-Authenticate: x402 and structured requirements (network: eip155:84532, price: $0.001, facilitator URL).'
    },
    {
      num: '03',
      title: 'Cryptographic Signing',
      role: 'Client Wallet',
      icon: <KeyRound className="w-5 h-5 text-[#fcd34d]" />,
      description: 'The client signs an EIP-712 payment authorization off-chain without broadcasting a transaction directly, keeping latency near zero.'
    },
    {
      num: '04',
      title: 'Facilitator Settlement',
      role: 'Facilitator &rarr; Blockchain',
      icon: <CheckCircle className="w-5 h-5 text-[#fcd34d]" />,
      description: 'Server forwards the signed authorization to the x402 facilitator for instant verification and settlement on Base Sepolia, returning 200 OK + PAYMENT-RESPONSE header.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-t border-[#181c2b] bg-[#090b10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#181c2b] border border-[#2d3349] text-xs text-[#fcd34d] mb-4">
            <span className="font-mono tracking-wider">PROTOCOL LIFECYCLE</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#f5f0e6] mb-4">
            How x402 Pay-Per-Call Works
          </h2>
          <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
            The x402 standard replaces bloated subscriptions and credit cards with a stateless, HTTP-native micropayment challenge loop.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="p-6 rounded-2xl bg-[#0e111a] border border-[#202638] hover:border-[#e5a93c]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-cinzel text-2xl font-bold text-[#e5a93c]/40 group-hover:text-[#e5a93c] transition-colors">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#e5a93c]/10 border border-[#e5a93c]/20 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                <div 
                  className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1" 
                  dangerouslySetInnerHTML={{ __html: step.role }} 
                />
                <h3 className="font-cinzel text-base font-bold text-[#f5f0e6] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < 3 && (
                <div className="hidden lg:flex items-center justify-end mt-4 text-[#e5a93c]/40">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Architecture Comparison Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#121520] border border-[#242b3d] max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#fcd34d] uppercase tracking-wider font-semibold">
                Traditional Web vs x402 Protocol
              </span>
              <h4 className="font-cinzel text-xl font-bold text-[#f5f0e6]">
                Why Subscriptions Are Obsolete for Machine APIs
              </h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Autonomous AI agents cannot fill out credit card forms, manage 50 monthly subscriptions, or verify 2FA phone numbers. With x402, every agent or user carries a wallet capable of paying $0.001 per request inline with zero human friction.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090b10] border border-[#1f2536] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-rose-400/90 pb-2 border-b border-[#1b202e]">
                <span>Old Model:</span>
                <span>$20/mo SaaS, Accounts, KYC</span>
              </div>
              <div className="flex items-center justify-between text-[#fcd34d] font-bold">
                <span>x402 Model:</span>
                <span>$0.001 / request, Instant, Stateless</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
