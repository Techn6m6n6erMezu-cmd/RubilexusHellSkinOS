import { useState, useEffect } from 'react';
import { Terminal, MessageSquare, Users, Wifi, Trash2, BookOpen, Share2, Server, Code2, FlaskConical } from 'lucide-react';
import HaezarianWorldShell from './components/HaezarianWorldShell';
import RubilexusTerminal from './components/RubilexusTerminal';
import TOLBEngine from './components/TOLBEngine';
import AudioStudio from './components/AudioStudio';
import GameStudio from './components/GameStudio';
import RubivisionCTP3 from './components/RubivisionCTP3';
import AssistantPanel from './components/AssistantPanel';
import SentientCouncil from './components/SentientCouncil';
import AgentPiP from './components/AgentPiP';
import FyfiProtocol from './components/FyfiProtocol';
import TrashPactDumpster from './components/TrashPactDumpster';
import ShadowLibrarian from './components/ShadowLibrarian';
import SoLlessStem from './components/SoLlessStem';
import PopBubble from './components/PopBubble';
import SigilMark from './components/SigilMark';
import RubipShadowPiP from './components/RubipShadowPiP';
import VaultBridge from './components/VaultBridge';
import { updateTerminalBranding } from './lib/rubilexusCore';
import { useAuth } from './contexts/AuthContext';
import { AuthGate } from './components/AuthGate';
import FateSealerGate from './components/FateSealerGate';

type ActiveTab = 'world' | 'rubilexus' | 'assistant' | 'council' | 'network' | 'soless' | 'tolb' | 'studio';
type NetworkView = 'fyfi' | 'trash' | 'shadow' | 'vault';

type NavTab = {
  id: ActiveTab;
  label: string;
  active: string;
  inactive: string;
  icon: React.ReactNode;
};

function GlobalRubiScan({ onDone }: { onDone: () => void }) {
  const [y, setY] = useState(-5);

  useEffect(() => {
    let cur = -5;
    const t = setInterval(() => {
      cur += 3;
      setY(cur);
      if (cur > 110) { clearInterval(t); onDone(); }
    }, 12);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      <div
        className="absolute left-0 right-0 h-1"
        style={{
          top: `${y}%`,
          background: 'linear-gradient(90deg, transparent 0%, #dc262680 20%, #ef4444 50%, #dc262680 80%, transparent 100%)',
          boxShadow: '0 0 20px 4px rgba(239,68,68,0.5), 0 0 60px 10px rgba(220,38,38,0.2)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(220,38,38,0.015)' }}
      />
    </div>
  );
}

const NAV_TABS: NavTab[] = [
  { id: 'world',     label: 'WORLD SHELL',  active: '#dc2626', inactive: '#4b5563', icon: <Share2    className="w-3.5 h-3.5" /> },
  { id: 'rubilexus', label: 'RUBILEXUS',    active: '#dc2626', inactive: '#4b5563', icon: <Terminal  className="w-3.5 h-3.5" /> },
  { id: 'assistant', label: 'ASSISTANT',    active: '#dc2626', inactive: '#4b5563', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: 'council',   label: 'COUNCIL',      active: '#dc2626', inactive: '#4b5563', icon: <Users     className="w-3.5 h-3.5" /> },
  { id: 'network',   label: 'NETWORK',      active: '#dc2626', inactive: '#4b5563', icon: <Wifi      className="w-3.5 h-3.5" /> },
  { id: 'soless',    label: 'SO.LESS STEM', active: '#dc2626', inactive: '#4b5563', icon: <FlaskConical className="w-3.5 h-3.5" /> },
  { id: 'tolb',      label: 'TOLB ENGINE',  active: '#dc2626', inactive: '#4b5563', icon: <Server    className="w-3.5 h-3.5" /> },
  { id: 'studio',    label: 'STUDIO',       active: '#dc2626', inactive: '#4b5563', icon: <Code2     className="w-3.5 h-3.5" /> },
];

const NETWORK_TABS: { id: NetworkView; label: string; icon: React.ReactNode }[] = [
  { id: 'fyfi',   label: 'FYFI PROTOCOL',  icon: <Wifi className="w-3.5 h-3.5" /> },
  { id: 'trash',  label: 'TRASH PACT',     icon: <Trash2 className="w-3.5 h-3.5" /> },
  { id: 'shadow', label: 'SHADOW LIB',     icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'vault',  label: 'VAULT BRIDGE',   icon: <Server className="w-3.5 h-3.5" /> },
];

export default function App() {
  const { user, loading } = useAuth();
  const [fateAccepted, setFateAccepted] = useState(
    () => localStorage.getItem('fate_sealer_accepted') === 'true' || localStorage.getItem('admin_mode') === 'true'
  );
  const [scanDone, setScanDone] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('world');
  const [networkView, setNetworkView] = useState<NetworkView>('fyfi');

  useEffect(() => {
    updateTerminalBranding();
  }, []);

  if (!fateAccepted) {
    return <FateSealerGate onAccept={() => { localStorage.setItem('fate_sealer_accepted', 'true'); setFateAccepted(true); }} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  const bypassed = localStorage.getItem('fate_sealer_accepted') === 'true' || localStorage.getItem('admin_mode') === 'true';

  if (!user && !bypassed) {
    return <AuthGate />;
  }

  return (
    <>
      {!scanDone && <GlobalRubiScan onDone={() => setScanDone(true)} />}

      <div className="min-h-screen bg-black flex flex-col" style={{ fontFamily: 'ui-monospace, monospace' }}>
        <nav
          className="sticky top-0 z-50 flex items-center gap-0 border-b overflow-x-auto"
          style={{ borderColor: '#dc262625', background: '#050505' }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 border-r shrink-0" style={{ borderColor: '#dc262620' }}>
            <SigilMark size={22} color="#dc2626" />
            <span className="text-xs font-bold tracking-widest" style={{ color: '#dc2626' }}>HAEZARIAN</span>
          </div>

          {NAV_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold tracking-widest transition-all border-r shrink-0"
              style={{
                borderColor: '#dc262615',
                color: activeTab === tab.id ? tab.active : tab.inactive,
                background: activeTab === tab.id ? '#dc262610' : 'transparent',
                borderBottom: activeTab === tab.id ? '2px solid #dc2626' : '2px solid transparent',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'world' && <HaezarianWorldShell />}

          {activeTab === 'rubilexus' && (
            <div className="h-full">
              <RubilexusTerminal />
            </div>
          )}

          {activeTab === 'assistant' && (
            <div className="h-full">
              <AssistantPanel />
            </div>
          )}

          {activeTab === 'council' && (
            <div className="h-full">
              <SentientCouncil />
            </div>
          )}

          {activeTab === 'network' && (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-0 border-b px-4" style={{ borderColor: '#dc262620', background: '#050505' }}>
                {NETWORK_TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setNetworkView(t.id)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold tracking-widest transition-all border-r"
                    style={{
                      borderColor: '#dc262615',
                      color: networkView === t.id ? '#dc2626' : '#4b5563',
                      background: networkView === t.id ? '#dc262610' : 'transparent',
                      borderBottom: networkView === t.id ? '2px solid #dc2626' : '2px solid transparent',
                    }}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-auto">
                {networkView === 'fyfi'   && <FyfiProtocol />}
                {networkView === 'trash'  && <TrashPactDumpster />}
                {networkView === 'shadow' && <ShadowLibrarian />}
                {networkView === 'vault'  && <VaultBridge />}
              </div>
            </div>
          )}

          {activeTab === 'soless' && (
            <div className="h-full">
              <SoLlessStem />
            </div>
          )}

          {activeTab === 'tolb' && (
            <div className="h-full">
              <TOLBEngine />
            </div>
          )}

          {activeTab === 'studio' && (
            <div className="flex flex-col gap-0 h-full overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-x divide-zinc-900">
                <AudioStudio />
                <GameStudio />
              </div>
              <RubivisionCTP3 />
            </div>
          )}
        </div>
      </div>

      <AgentPiP />
      <RubipShadowPiP />
      <PopBubble />
    </>
  );
}
