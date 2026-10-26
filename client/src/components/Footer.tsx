import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-[#181c2b] bg-[#050609] text-xs text-[#64748b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Branding & Hackathon Attribution */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <img src="/bioscope-lens.svg" alt="Bioscope" className="w-5 h-5 object-contain" />
            <span className="font-cinzel font-bold text-sm text-[#f5f0e6]">
              BIOSCOPE AI
            </span>
          </div>
          <span className="hidden sm:inline text-[#2d3448]">&bull;</span>
          <span>
            Built for <strong className="text-[#cbd5e1]">Road to Devcon VI — x402: Pay-Per-Call</strong> Hackathon
          </span>
        </div>

        {/* Center: Ecosystem Links */}
        <div className="flex items-center space-x-6 text-[11px] font-mono">
          <a
            href="https://github.com/x402-foundation/x402"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#fcd34d] transition-colors flex items-center space-x-1"
          >
            <span>x402 Foundation</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://docs.cdp.coinbase.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#fcd34d] transition-colors flex items-center space-x-1"
          >
            <span>Coinbase CDP</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://sepolia.basescan.org/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#fcd34d] transition-colors flex items-center space-x-1"
          >
            <span>Base Sepolia</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Right: Copyright */}
        <div className="text-[11px] text-[#475569]">
          MIT Open Source &bull; lahotida-wq
        </div>

      </div>
    </footer>
  );
};
