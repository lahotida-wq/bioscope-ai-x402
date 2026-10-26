import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, RotateCcw, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

interface ApiPlaygroundProps {
  apiUrl: string;
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({ apiUrl }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/paid/city');
  const [requestBodyText, setRequestBodyText] = useState<string>(
    JSON.stringify({ city: 'Nashik', interests: ['vineyards', 'temples'] }, null, 2)
  );

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Playground inspection states
  const [challengeHeaders, setChallengeHeaders] = useState<Record<string, string> | null>(null);
  const [challengeBody, setChallengeBody] = useState<any>(null);

  const [settledHeaders, setSettledHeaders] = useState<Record<string, string> | null>(null);
  const [settledBody, setSettledBody] = useState<any>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSendUnpaid = async () => {
    setLoading(true);
    setActiveStep(1);
    setChallengeHeaders(null);
    setChallengeBody(null);
    setSettledHeaders(null);
    setSettledBody(null);

    try {
      const res = await fetch(`${apiUrl}${selectedEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBodyText
      });

      const headersObj: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headersObj[key] = val;
      });

      const bodyJson = await res.json().catch(() => ({}));

      setChallengeHeaders(headersObj);
      setChallengeBody(bodyJson);
      setActiveStep(2);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendPaid = async () => {
    setLoading(true);

    try {
      const authSignature = `mock-sig-${Date.now()}-playground`;

      const res = await fetch(`${apiUrl}${selectedEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PAYMENT-SIGNATURE': authSignature
        },
        body: requestBodyText
      });

      const headersObj: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headersObj[key] = val;
      });

      const bodyJson = await res.json().catch(() => ({}));

      setSettledHeaders(headersObj);
      setSettledBody(bodyJson);
      setActiveStep(3);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActiveStep(1);
    setChallengeHeaders(null);
    setChallengeBody(null);
    setSettledHeaders(null);
    setSettledBody(null);
  };

  const curlCommand = `curl -X POST ${apiUrl}${selectedEndpoint} \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <base64_encoded_signature>" \\
  -d '${requestBodyText.replace(/\n/g, '').replace(/\s+/g, ' ')}'`;

  return (
    <section id="playground" className="py-16 sm:py-24 border-t border-[#181c2b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#181c2b] border border-[#2d3349] text-xs text-[#fcd34d] mb-4">
            <Terminal className="w-3.5 h-3.5 text-[#e5a93c]" />
            <span className="font-mono tracking-wider">DEVELOPER CONSOLE</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#f5f0e6] mb-4">
            Interactive x402 Protocol Playground
          </h2>
          <p className="text-sm sm:text-base text-[#94a3b8]">
            Directly test the full 3-step x402 flow: inspect the unauthenticated call, examine the raw HTTP 402 challenge headers, and authorize settlement to receive the insight.
          </p>
        </div>

        {/* Playground Container */}
        <div className="rounded-3xl bg-[#0c0e16] border border-[#23293d] p-6 sm:p-8 shadow-2xl">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-[#1f2538]">
            
            {/* Endpoint Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-[#fcd34d] uppercase tracking-wider">
                Endpoint:
              </span>
              <div className="flex space-x-1.5 bg-[#121520] p-1 rounded-xl border border-[#202738]">
                {[
                  { label: 'City Bioscope', path: '/api/paid/city' },
                  { label: 'Explainer', path: '/api/paid/explain' },
                  { label: 'Developer', path: '/api/paid/developer' }
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      setSelectedEndpoint(item.path);
                      if (item.path === '/api/paid/city') {
                        setRequestBodyText(JSON.stringify({ city: 'Nashik', interests: ['vineyards'] }, null, 2));
                      } else if (item.path === '/api/paid/explain') {
                        setRequestBodyText(JSON.stringify({ topic: 'x402 Protocol', difficulty: 'intermediate' }, null, 2));
                      } else {
                        setRequestBodyText(JSON.stringify({ topic: 'x402 Middleware' }, null, 2));
                      }
                      handleReset();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                      selectedEndpoint === item.path
                        ? 'bg-[#e5a93c] text-[#07080c] font-bold'
                        : 'text-[#94a3b8] hover:text-[#f5f0e6]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSendUnpaid}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-[#e5a93c] text-[#07080c] hover:bg-[#fcd34d] font-bold text-xs font-mono flex items-center space-x-2 transition-all shadow-md shadow-[#e5a93c]/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>1. Request (Unpaid)</span>
              </button>

              <button
                onClick={handleSendPaid}
                disabled={loading || activeStep < 2}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07080c] font-bold text-xs font-mono flex items-center space-x-2 transition-all disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-emerald-500/20"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2. Pay & Retry</span>
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-[#141724] border border-[#252c40] text-[#94a3b8] hover:text-[#f5f0e6] transition-colors"
                title="Reset Playground"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Three-Column Flow Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
            
            {/* Step 1: Client Request Payload */}
            <div className="p-4 rounded-2xl bg-[#0f121d] border border-[#20273a] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1b2133]">
                  <span className="text-xs font-mono font-semibold text-[#cbd5e1] flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    <span>1. Client Request</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#38bdf8] uppercase">
                    POST JSON
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-[#94a3b8]">
                    URL: <span className="text-[#e2e8f0]">{selectedEndpoint}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#64748b] mb-1">
                      Request Body:
                    </label>
                    <textarea
                      value={requestBodyText}
                      onChange={(e) => setRequestBodyText(e.target.value)}
                      rows={5}
                      className="w-full p-2.5 rounded-lg bg-[#07080c] border border-[#1e2436] font-mono text-xs text-[#fcd34d] focus:outline-none focus:border-[#e5a93c]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1b2133] flex justify-between items-center text-[11px] text-[#94a3b8]">
                <span>State: Ready</span>
                <span className="text-[#38bdf8] font-mono">No Payment Header</span>
              </div>
            </div>

            {/* Step 2: HTTP 402 Challenge Inspector */}
            <div className={`p-4 rounded-2xl bg-[#0f121d] border transition-all ${
              activeStep >= 2 ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-[#20273a]'
            }`}>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1b2133]">
                <span className="text-xs font-mono font-semibold text-[#cbd5e1] flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${challengeHeaders ? 'bg-amber-400' : 'bg-slate-600'}`}></span>
                  <span>2. HTTP 402 Challenge</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-bold">
                  {challengeHeaders ? 'STATUS 402' : 'WAITING'}
                </span>
              </div>

              {challengeHeaders ? (
                <div className="space-y-3 font-mono text-[11px]">
                  <div>
                    <span className="text-[10px] uppercase text-[#64748b] block mb-0.5">Key Headers:</span>
                    <div className="p-2 rounded bg-[#07080c] border border-[#1c2132] text-[#f5f0e6] space-y-1">
                      <div className="truncate"><span className="text-amber-400">WWW-Authenticate:</span> x402</div>
                      <div className="truncate"><span className="text-amber-400">PAYMENT-REQUIRED:</span> {challengeHeaders['payment-required']?.slice(0, 32)}...</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#64748b] block mb-0.5">Requirements JSON:</span>
                    <pre className="p-2 rounded bg-[#07080c] border border-[#1c2132] text-[#cbd5e1] overflow-x-auto text-[10px] max-h-36">
                      {JSON.stringify(challengeBody?.accepts || challengeBody, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-[#64748b]">
                  Press "1. Request (Unpaid)" above to trigger the 402 challenge.
                </div>
              )}
            </div>

            {/* Step 3: Fulfill & Settle (200 OK) */}
            <div className={`p-4 rounded-2xl bg-[#0f121d] border transition-all ${
              activeStep === 3 ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-[#20273a]'
            }`}>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1b2133]">
                <span className="text-xs font-mono font-semibold text-[#cbd5e1] flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${settledHeaders ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                  <span>3. Settled Response</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-300 font-bold">
                  {settledHeaders ? 'STATUS 200' : 'PENDING'}
                </span>
              </div>

              {settledHeaders ? (
                <div className="space-y-3 font-mono text-[11px]">
                  <div>
                    <span className="text-[10px] uppercase text-[#64748b] block mb-0.5">Settlement Header:</span>
                    <div className="p-2 rounded bg-[#07080c] border border-[#1c2132] text-[#a7f3d0] truncate">
                      <span className="text-emerald-400">PAYMENT-RESPONSE:</span> {settledHeaders['payment-response']?.slice(0, 32)}...
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#64748b] block mb-0.5">Delivered Payload:</span>
                    <pre className="p-2 rounded bg-[#07080c] border border-[#1c2132] text-[#a7f3d0] overflow-x-auto text-[10px] max-h-36">
                      {JSON.stringify(settledBody?.data || settledBody, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-[#64748b]">
                  {activeStep === 2 ? 'Challenge received! Press "2. Pay & Retry" to settle.' : 'Awaiting challenge step.'}
                </div>
              )}
            </div>

          </div>

          {/* Bottom Bar: Copyable cURL and CLI pay-client Guide */}
          <div className="mt-8 pt-6 border-t border-[#1f2538] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-[#cbd5e1] uppercase tracking-wider font-semibold">
                  Copyable Terminal Command:
                </span>
                <button
                  onClick={() => handleCopy(curlCommand, 'curl')}
                  className="text-xs font-mono text-[#fcd34d] hover:underline flex items-center space-x-1"
                >
                  {copied === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'curl' ? 'Copied!' : 'Copy cURL'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-[#07080c] border border-[#1c2132] font-mono text-xs text-[#fcd34d] overflow-x-auto">
                {curlCommand}
              </pre>
            </div>

            {/* CLI Client Callout */}
            <div className="lg:max-w-sm p-4 rounded-xl bg-[#141724] border border-[#23293d] space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-[#fcd34d]">
                <Terminal className="w-4 h-4 text-[#e5a93c]" />
                <span>Headless Testing with CLI</span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Run the official CLI payment client locally in your terminal to test complete Base Sepolia EIP-712 signing:
              </p>
              <div className="font-mono text-xs bg-[#090a0f] p-2 rounded-lg text-emerald-400 border border-[#1f2638]">
                npm run cli:pay --workspace=server
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
