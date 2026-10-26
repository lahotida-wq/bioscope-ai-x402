import React from 'react';
import { PaymentSettlementReceipt } from '../types';
import { Receipt, ExternalLink, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

interface ReceiptPanelProps {
  receipts: PaymentSettlementReceipt[];
}

export const ReceiptPanel: React.FC<ReceiptPanelProps> = ({ receipts }) => {
  if (receipts.length === 0) return null;

  return (
    <section className="py-12 border-t border-[#181c2b] bg-[#07090e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center space-x-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#e5a93c]/10 border border-[#e5a93c]/30 flex items-center justify-center text-[#fcd34d]">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-[#f5f0e6]">
              Verified Settlement Receipts
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Cryptographic settlement receipts captured from HTTP PAYMENT-RESPONSE response headers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {receipts.map((r, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#0f121d] border border-[#20273a] font-mono text-xs space-y-2.5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#1b202e]">
                <span className="text-[10px] text-[#fcd34d] font-bold uppercase tracking-wider">
                  Settlement #{receipts.length - i}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                  r.isSimulated ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'
                }`}>
                  {r.isSimulated ? 'SIMULATED DEMO' : 'BASE SEPOLIA'}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-[#94a3b8]">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="text-[#f5f0e6] font-semibold">{r.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="text-[#f5f0e6]">{r.network}</span>
                </div>
                <div className="flex justify-between truncate">
                  <span>PayTo:</span>
                  <span className="text-[#e2e8f0] truncate max-w-[180px]">{r.payTo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span className="text-[#cbd5e1]">{new Date(r.settledAt).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1b202e] text-[10px]">
                {r.isSimulated ? (
                  <span className="text-amber-400 font-semibold">
                    {r.note || 'SIMULATED PAYMENT — NO FUNDS TRANSFERRED'}
                  </span>
                ) : r.transactionHash ? (
                  <a
                    href={r.blockExplorerUrl || `https://sepolia.basescan.org/tx/${r.transactionHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 underline"
                  >
                    <span>Tx: {r.transactionHash.slice(0, 10)}...</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                ) : (
                  <span className="text-emerald-400">Settled on-chain via Facilitator</span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
