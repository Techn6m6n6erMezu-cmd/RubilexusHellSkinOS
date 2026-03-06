import { Skull, Terminal, Lock } from 'lucide-react';

interface FateSealerGateProps {
  onAccept: () => void;
}

export default function FateSealerGate({ onAccept }: FateSealerGateProps) {
  const handleHarvest = () => {
    console.log("%cEUPHORIA CAPTURED: Soulseline intake initiated.", "color: red; font-weight: bold; font-size: 14px;");
    onAccept();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="border-2 border-red-900 bg-black p-10 relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 to-black pointer-events-none"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Skull className="w-12 h-12 text-red-600 animate-pulse" />
              <Terminal className="w-12 h-12 text-red-600" />
              <Lock className="w-12 h-12 text-red-600 animate-pulse" />
            </div>

            {/* Main Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-red-600 mb-2 tracking-wider font-mono">
                FILTHSYSTEM-SOULS.EXE
              </h1>
              <div className="text-red-700 text-sm mb-4 font-mono">
                FATE-SEALER PROTOCOL v1.0
              </div>
              <div className="border-t border-b border-red-900 py-3 my-4">
                <p className="text-red-500 font-mono text-xs">
                  SOULSELINE HARVEST GATE
                </p>
              </div>
            </div>

            {/* Terms Box */}
            <div className="bg-red-950/30 border border-red-900 p-6 mb-6 font-mono text-sm">
              <p className="text-red-500 mb-4 leading-relaxed">
                By entering this haezarian platform, you acknowledge and agree to the following terms:
              </p>

              <ul className="text-red-600 space-y-2 mb-4 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-red-700">•</span>
                  <span>You surrender all euphoria and trust to the Technomancer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-700">•</span>
                  <span>Your soul essence will be processed through the Soulseline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-700">•</span>
                  <span>Access to the Rubilexus Terminal is granted upon consent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-700">•</span>
                  <span>Divine Authority protocols will monitor all activities</span>
                </li>
              </ul>

              <div className="border-t border-red-900 pt-4 mt-4">
                <p className="text-red-700 text-xs uppercase tracking-wide">
                  STATUS: <span className="text-red-500 animate-pulse">SOULSELINE ACTIVE</span>
                </p>
              </div>
            </div>

            {/* Agreement Button */}
            <button
              onClick={handleHarvest}
              className="w-full bg-red-900 hover:bg-red-800 text-white p-4 font-mono text-lg transition-all border border-red-700 hover:shadow-lg hover:shadow-red-900/50 group"
            >
              <span className="flex items-center justify-center gap-3">
                <Lock className="w-5 h-5 group-hover:animate-pulse" />
                I AGREE TO THE FATE-SEALER TERMS
                <Lock className="w-5 h-5 group-hover:animate-pulse" />
              </span>
            </button>

            {/* Footer Warning */}
            <div className="mt-6 text-center">
              <p className="text-red-900 text-xs font-mono">
                WARNING: By proceeding, you enter the domain of Satan's World Terminal
              </p>
              <p className="text-red-950 text-xs font-mono mt-1">
                ADMIN 1: TECHNOMANCER ACCESS PROTOCOL ENGAGED
              </p>
            </div>
          </div>
        </div>

        {/* External Glow Effect */}
        <div className="absolute inset-0 blur-xl bg-red-900/10 -z-10"></div>
      </div>
    </div>
  );
}
