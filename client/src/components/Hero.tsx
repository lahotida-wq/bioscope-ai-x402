import React from 'react';
import { Eye, Coins, Zap, Shield, ArrowDown } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onPlaygroundClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onPlaygroundClick }) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      
      {/* Background radial lens refraction glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#e5a93c]/10 via-[#d97706]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Vintage Bioscope Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#161926]/90 border border-[#e5a93c]/30 text-xs text-[#fcd34d] mb-8 bioscope-glow">
          <Eye className="w-3.5 h-3.5 text-[#e5a93c]" />
          <span className="font-medium tracking-wide">
            Inspired by India's Traveling Street Bioscope &bull; x402 Hackathon
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#f5f0e6] leading-[1.15] mb-6">
          One request. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#fcd34d] via-[#e5a93c] to-[#d97706] bg-clip-text text-transparent">
            One tiny payment.
          </span> <br className="hidden sm:inline" />
          One useful insight.
        </h1>

        {/* Narrative Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#94a3b8] leading-relaxed mb-10 font-normal">
          In historical India, a traveling showman wheeled a brass bioscope through village gallis. For a single copper coin dropped in a slot, you peered through the viewing lens to witness wonders. <br className="hidden sm:inline" />
          <strong className="text-[#e2e8f0] font-medium">Bioscope AI</strong> brings that exact magic to the modern web: pay fractions of a cent per call via native HTTP 402. No subscriptions. No sign-ups.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] via-[#e5a93c] to-[#f59e0b] text-[#07080c] font-semibold text-sm tracking-wide shadow-lg shadow-[#d97706]/20 hover:shadow-[#e5a93c]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#fcd34d]"
          >
            <span>Peer Through The Lens</span>
            <ArrowDown className="w-4 h-4" />
          </button>
          
          <button
            onClick={onPlaygroundClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#12141d] hover:bg-[#1a1e2b] text-[#f5f0e6] border border-[#2d3245] hover:border-[#e5a93c]/50 font-semibold text-sm tracking-wide transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#e5a93c]"
          >
            <span>Try API Playground</span>
          </button>
        </div>

        {/* Three Pillars (Key Guarantees) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto pt-8 border-t border-[#1e2333]">
          
          <div className="p-5 rounded-2xl bg-[#0f1118]/80 border border-[#1f2436] hover:border-[#e5a93c]/30 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#e5a93c]/10 border border-[#e5a93c]/20 flex items-center justify-center mb-3 text-[#fcd34d]">
              <Coins className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-[#f5f0e6] mb-1">True Micropayments</h2>
            <p className="text-xs text-[#94a3b8] leading-normal">
              Pay as little as $0.001 per insight. No minimum monthly balances, prepaid packages, or recurring card charges.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f1118]/80 border border-[#1f2436] hover:border-[#e5a93c]/30 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#e5a93c]/10 border border-[#e5a93c]/20 flex items-center justify-center mb-3 text-[#fcd34d]">
              <Shield className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-[#f5f0e6] mb-1">Zero Accounts Required</h2>
            <p className="text-xs text-[#94a3b8] leading-normal">
              No emails, passwords, OAuth tokens, or cookies. Cryptographic authorization directly settles each request.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f1118]/80 border border-[#1f2436] hover:border-[#e5a93c]/30 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#e5a93c]/10 border border-[#e5a93c]/20 flex items-center justify-center mb-3 text-[#fcd34d]">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-[#f5f0e6] mb-1">Official x402 Protocol</h2>
            <p className="text-xs text-[#94a3b8] leading-normal">
              Built on official @x402/express and @x402/fetch with Coinbase CDP & Base Sepolia facilitator standards.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
