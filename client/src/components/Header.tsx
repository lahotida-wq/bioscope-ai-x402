import React from 'react';
import { HealthInfo } from '../types';
import { ShieldCheck, Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  health: HealthInfo | null;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ health, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#07080c]/85 border-b border-[#232736]/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => onNavigate('hero')}
          className="flex items-center space-x-3.5 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="Bioscope AI Home"
        >
          <div className="relative w-11 h-11 flex-shrink-0">
            <img 
              src="/bioscope-lens.svg" 
              alt="Bioscope AI Logo" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(229,169,60,0.5)] group-hover:scale-105 transition-transform" 
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#f5f0e6] group-hover:text-[#fcd34d] transition-colors">
                BIOSCOPE <span className="text-[#e5a93c]">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-[#e5a93c]/15 text-[#fcd34d] border border-[#e5a93c]/30 font-semibold">
                x402
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] tracking-tight font-medium hidden sm:block">
              Pay Per Insight — Road to Devcon VI
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#94a3b8]" aria-label="Main Navigation">
          <button 
            onClick={() => onNavigate('experiences')} 
            className="hover:text-[#fcd34d] transition-colors flex items-center space-x-1.5 focus:outline-none focus:text-[#fcd34d]"
          >
            <Sparkles className="w-4 h-4 text-[#e5a93c]" />
            <span>Experiences</span>
          </button>
          <button 
            onClick={() => onNavigate('how-it-works')} 
            className="hover:text-[#fcd34d] transition-colors flex items-center space-x-1.5 focus:outline-none focus:text-[#fcd34d]"
          >
            <BookOpen className="w-4 h-4 text-[#e5a93c]" />
            <span>How x402 Works</span>
          </button>
          <button 
            onClick={() => onNavigate('playground')} 
            className="hover:text-[#fcd34d] transition-colors flex items-center space-x-1.5 focus:outline-none focus:text-[#fcd34d]"
          >
            <Terminal className="w-4 h-4 text-[#e5a93c]" />
            <span>API Playground</span>
          </button>
        </nav>

        {/* Network & Payment Status Badge */}
        <div className="flex items-center space-x-3">
          {health ? (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#12141d] border border-[#272b3b] text-xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${health.payment.isSimulated ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${health.payment.isSimulated ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              <span className="font-mono text-[11px] text-[#e2e8f0]">
                {health.payment.isSimulated ? 'SIMULATED DEMO' : health.payment.network}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#12141d] border border-[#272b3b] text-xs text-[#94a3b8]">
              <Layers className="w-3.5 h-3.5 animate-spin text-[#e5a93c]" />
              <span className="font-mono text-[11px]">Connecting...</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
