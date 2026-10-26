import React from 'react';
import { AlertTriangle, Info, ArrowUpRight } from 'lucide-react';

interface MockBannerProps {
  isSimulated: boolean;
}

export const MockBanner: React.FC<MockBannerProps> = ({ isSimulated }) => {
  if (!isSimulated) return null;

  return (
    <div 
      className="bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 border-y border-amber-500/30 px-4 py-2.5 text-xs text-amber-200"
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="font-semibold tracking-wide uppercase text-amber-300">
            SIMULATED PAYMENT — NO FUNDS TRANSFERRED
          </span>
          <span className="hidden md:inline text-amber-200/70">
            — Local development mode is active. Requests simulate RFC-402 challenge-settlement without consuming testnet funds.
          </span>
        </div>
        
        <div className="flex items-center space-x-3 text-[11px] font-mono text-amber-300">
          <span className="flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Network: Base Sepolia (eip155:84532)</span>
          </span>
        </div>
      </div>
    </div>
  );
};
