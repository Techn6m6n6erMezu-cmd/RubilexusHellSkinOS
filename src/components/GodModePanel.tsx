import { useState, useEffect } from 'react';
import { Shield, Check, X, Zap, Settings2 } from 'lucide-react';
import { checkGodMode, getGodModePermissions } from '../services/simWorldService';
import { useAuth } from '../contexts/AuthContext';
import SystemBranding from './SystemBranding';

type PanelTab = 'godmode' | 'branding';

export default function GodModePanel() {
  const [hasGodMode, setHasGodMode] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<PanelTab>('godmode');
  const { user } = useAuth();

  useEffect(() => {
    checkAccess();
  }, [user]);

  const checkAccess = async () => {
    if (!user?.email) {
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    const godMode = await checkGodMode(user.email);
    setHasGodMode(godMode);

    if (godMode) {
      const perms = await getGodModePermissions(user.email);
      setPermissions(perms);
    }

    setIsChecking(false);
  };

  if (isChecking) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="text-center text-gray-500 font-mono">Checking god-mode access...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'godmode' as PanelTab, label: 'GOD MODE', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'branding' as PanelTab, label: 'SYSTEM BRANDING', icon: <Settings2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 border text-xs font-bold font-mono transition-all ${
              activeTab === tab.id
                ? 'bg-yellow-950 border-yellow-700 text-yellow-400'
                : 'bg-gray-900 border-gray-800 text-gray-600 hover:border-yellow-900 hover:text-yellow-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'godmode' && (
        <>
          {!hasGodMode ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <X className="w-8 h-8 text-gray-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-500 font-mono">GOD-MODE ACCESS</h3>
                  <p className="text-gray-600 text-xs font-mono">STATUS: DENIED</p>
                </div>
              </div>
              <p className="text-gray-600 font-mono text-sm">
                Your account does not have god-mode permissions. Contact an administrator for access.
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-yellow-950 to-black border-4 border-yellow-700 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <Shield className="w-12 h-12 text-yellow-500 animate-pulse" />
                    <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-50 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-yellow-500 font-mono">GOD-MODE ACTIVE</h3>
                    <p className="text-yellow-700 text-sm font-mono">HELLSKIN OS / RUBILEXUS PROTOCOL OVERRIDE</p>
                  </div>
                </div>

                <div className="bg-black border border-yellow-900 rounded p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-yellow-500 font-mono text-sm">AUTHORIZED USER:</span>
                    <span className="text-yellow-400 font-mono font-bold">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-400 font-mono text-xs">FULL SYSTEM ACCESS GRANTED</span>
                  </div>
                </div>

                <div className="bg-black border border-yellow-900 rounded p-4 mb-6">
                  <h4 className="text-yellow-500 font-mono font-bold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    ACTIVE PERMISSIONS
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map(perm => (
                      <div key={perm} className="bg-yellow-950/30 border border-yellow-900 rounded px-3 py-2 flex items-center gap-2">
                        <Check className="w-3 h-3 text-yellow-500" />
                        <span className="text-yellow-400 font-mono text-xs uppercase">{perm.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-950/20 border border-yellow-900 rounded p-4">
                  <h4 className="text-yellow-500 font-mono font-bold mb-3">CAPABILITIES:</h4>
                  <ul className="space-y-2 text-yellow-400 font-mono text-sm">
                    {[
                      'Full control over NPC behaviors and world state',
                      'Ability to spawn and modify content',
                      'Override all system rules and constraints',
                      'Access to Magik Core absolute memory',
                      'Rubilexus Terminal divine authority',
                      'System Branding & Sigil-Swapper control',
                    ].map(cap => (
                      <li key={cap} className="flex items-start gap-2">
                        <span className="text-yellow-700">•</span>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 p-3 bg-yellow-950/20 border border-yellow-900 rounded">
                  <p className="text-yellow-700 font-mono text-xs">
                    <strong className="text-yellow-500">AUTHORIZED EMAILS:</strong>{' '}
                    horse4206@gmail.com, aaronslone09@gmail.com
                  </p>
                  <p className="text-yellow-700 font-mono text-xs mt-1">
                    <strong className="text-yellow-500">LEGAL PATENT:</strong> Property of Ryan James
                    Cortright (Lucie Forebs) and John Aaron Slone (DJ G-raffe)
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'branding' && (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
          <SystemBranding />
        </div>
      )}
    </div>
  );
}
