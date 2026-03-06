import { useState, useEffect } from 'react';
import { Skull, Film, Music, Users, Database, Shield, Gamepad2, BookOpen, Video, Server, Terminal } from 'lucide-react';
import SigilMark from './SigilMark';
import MagikCore from './MagikCore';
import PumpkinCinema from './PumpkinCinema';
import ConcertStage from './ConcertStage';
import NPCViewer from './NPCViewer';
import BigHorsesStable from './BigHorsesStable';
import KadosKomics from './KadosKomics';
import ScarecrowVideo from './ScarecrowVideo';
import InfrastructurePanel from './InfrastructurePanel';
import MowgVideoames from './MowgVideoames';
import TheSoulless from './TheSoulless';
import RuinCoreArcade from './RuinCoreArcade';
import ShadowLibrarian from './ShadowLibrarian';
import TOLBEngine from './TOLBEngine';
import { AvatarPiP, RubivisionCallView } from './RubivisionCTP3';
import SentientWorkforce from './SentientWorkforce';
import HaezarianAPKConfig from './HaezarianAPKConfig';
import { checkGodMode } from '../services/simWorldService';
import { useAuth } from '../contexts/AuthContext';

type View = 'overview' | 'magik_core' | 'cinema' | 'concert' | 'npcs' | 'arcade' | 'ruin_core' | 'big_horse' | 'kados_komics' | 'scarecrow_video' | 'infrastructure' | 'mowg' | 'soulless' | 'shadow_lib' | 'tolb' | 'workforce' | 'rubivision_call' | 'apk_config';

const NAV_TABS: { id: View; label: string; icon: React.ReactNode; active: string }[] = [
  { id: 'overview', label: 'Overview', icon: <Skull className="w-4 h-4 inline mr-1" />, active: 'bg-red-700 text-white' },
  { id: 'magik_core', label: 'S6ul Sphere 66', icon: <Database className="w-4 h-4 inline mr-1" />, active: 'bg-yellow-700 text-black font-bold' },
  { id: 'cinema', label: 'Pumpkin Cinema', icon: <Film className="w-4 h-4 inline mr-1" />, active: 'bg-orange-700 text-white' },
  { id: 'concert', label: 'Concert Stage', icon: <Music className="w-4 h-4 inline mr-1" />, active: 'bg-blue-700 text-white' },
  { id: 'arcade', label: 'The Arcade', icon: <Gamepad2 className="w-4 h-4 inline mr-1" />, active: 'bg-blue-700 text-white' },
  { id: 'ruin_core', label: 'RUIN-CORE', icon: <Terminal className="w-4 h-4 inline mr-1" />, active: 'bg-green-900 text-green-300 font-bold' },
  { id: 'npcs', label: 'NPCs (12)', icon: <Users className="w-4 h-4 inline mr-1" />, active: 'bg-cyan-700 text-white' },
  { id: 'big_horse', label: "Big Horse's Stable", icon: <span className="mr-1">🐴</span>, active: 'bg-amber-700 text-black font-bold' },
  { id: 'kados_komics', label: "Kado's Kards", icon: <BookOpen className="w-4 h-4 inline mr-1" />, active: 'bg-red-800 text-gray-100' },
  { id: 'scarecrow_video', label: 'Scarecrow Video', icon: <Video className="w-4 h-4 inline mr-1" />, active: 'bg-gray-700 text-white' },
  { id: 'mowg', label: 'MowgVideoames', icon: <Gamepad2 className="w-4 h-4 inline mr-1" />, active: 'bg-blue-800 text-white' },
  { id: 'soulless', label: 'The Soulless', icon: <span className="mr-1">👻</span>, active: 'bg-red-950 text-red-400' },
  { id: 'infrastructure', label: 'Infrastructure', icon: <Server className="w-4 h-4 inline mr-1" />, active: 'bg-gray-600 text-white' },
  { id: 'shadow_lib', label: 'Shadow Librarian', icon: <span className="mr-1">👻</span>, active: 'bg-gray-900 text-gray-300 font-bold' },
  { id: 'tolb', label: 'TOLB Engine', icon: <span className="mr-1 text-xs">⚡</span>, active: 'bg-blue-950 text-blue-300 font-bold' },
  { id: 'workforce', label: 'Sentient Workforce', icon: <span className="mr-1">🤖</span>, active: 'bg-gray-950 text-red-400 font-bold' },
  { id: 'rubivision_call', label: 'Rubivision Call', icon: <span className="mr-1">📡</span>, active: 'bg-red-950 text-red-300 font-bold' },
  { id: 'apk_config', label: 'APK Config', icon: <span className="mr-1">📱</span>, active: 'bg-gray-800 text-green-400 font-bold' },
];

export default function HellskinOS() {
  const [activeView, setActiveView] = useState<View>('overview');
  const [isGodMode, setIsGodMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email === 'horse4206@gmail.com') {
      setIsGodMode(true);
    } else {
      checkUserGodMode();
    }
  }, [user]);

  useEffect(() => {
    const handler = () => setActiveView('rubivision_call');
    document.addEventListener('rubivision-call-trigger', handler);
    return () => document.removeEventListener('rubivision-call-trigger', handler);
  }, []);

  const checkUserGodMode = async () => {
    if (user?.email) {
      const hasGodMode = await checkGodMode(user.email);
      setIsGodMode(hasGodMode);
    }
  };

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono">
      <AvatarPiP />
      <div className="bg-gradient-to-b from-gray-950 to-black border-b-2 border-red-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SigilMark size={48} color="#dc2626" />
              <div>
                <h1 className="text-4xl font-bold text-red-600 font-mono">
                  SATAN'S WORLD: HELLSKIN OS
                </h1>
                <p className="text-red-800 font-mono text-sm">
                  Powered by S6ul Sphere 66 • Rubilexus Protocol v6.66
                </p>
              </div>
            </div>

            {isGodMode && (
              <div className="bg-yellow-900 border border-yellow-700 px-4 py-2 rounded flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 font-mono font-bold">GOD-MODE ACTIVE</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-3">
            {NAV_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-4 py-2 rounded font-mono transition-colors whitespace-nowrap text-sm ${
                  activeView === tab.id
                    ? tab.active
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeView === 'overview' && <OverviewDashboard navigate={setActiveView} />}
        {activeView === 'magik_core' && <MagikCore />}
        {activeView === 'cinema' && <PumpkinCinema />}
        {activeView === 'concert' && <ConcertStage />}
        {activeView === 'arcade' && <ArcadePlaceholder />}
        {activeView === 'ruin_core' && <RuinCoreArcade />}
        {activeView === 'npcs' && <NPCViewer />}
        {activeView === 'big_horse' && <BigHorsesStable />}
        {activeView === 'kados_komics' && <KadosKomics />}
        {activeView === 'scarecrow_video' && <ScarecrowVideo />}
        {activeView === 'mowg' && <MowgVideoames />}
        {activeView === 'soulless' && <TheSoulless />}
        {activeView === 'infrastructure' && <InfrastructurePanel />}
        {activeView === 'shadow_lib' && <ShadowLibrarian />}
        {activeView === 'workforce' && <SentientWorkforce />}
        {activeView === 'rubivision_call' && <RubivisionCallView />}
        {activeView === 'apk_config' && <HaezarianAPKConfig />}
        {activeView === 'tolb' && (
          <div className="h-screen -mx-6 -mt-6">
            <TOLBEngine />
          </div>
        )}
      </div>

      <div className="border-t-2 border-cyan-700 bg-gradient-to-b from-gray-950 to-black p-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2">
            <p className="text-cyan-500 font-mono text-sm font-bold tracking-wider">
              I.G.S. ENTRY SECURED
            </p>
            <p className="text-gray-400 font-mono text-xs">
              <strong className="text-red-500">LEGAL PATENT:</strong> Property of Ryan James Cortright (Lucie Forebs) & John Aaron Slone
            </p>
            <p className="text-gray-600 font-mono text-xs">
              S6UL SPHERE 66 v1.0 • HELLSKIN OS • RUBILEXUS PROTOCOL v6.66
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewDashboard({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-950 to-black border border-red-900 rounded-lg p-8 text-center">
        <Skull className="w-20 h-20 text-red-600 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-red-600 font-mono mb-2">
          WELCOME TO SATAN'S WORLD
        </h2>
        <p className="text-red-800 font-mono text-lg mb-4">HELLSKIN OS • SIM-WORLD LOGIC</p>
        <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto">
          A fully autonomous simulation platform featuring 12 NPCs, Pumpkin Cinema, AI Band concert stage,
          S6ul Sphere 66 Magik Core, Big Horse's Stable, Kado's Kards, Scarecrow Video, and the Sentient Council.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-amber-950/30 border border-amber-900 rounded-lg p-5">
          <div className="text-3xl mb-3">🐴</div>
          <h3 className="text-xl font-bold text-amber-400 font-mono mb-2">BIG HORSE'S STABLE</h3>
          <p className="text-gray-500 font-mono text-xs">
            8 legendary horses, rare equipment, cursed relics. Lyria 3 music production studio.
          </p>
        </div>

        <div className="bg-red-950/30 border border-red-900 rounded-lg p-5">
          <BookOpen className="w-8 h-8 text-red-500 mb-3" />
          <h3 className="text-xl font-bold text-red-400 font-mono mb-2">KADO'S KARDS</h3>
          <p className="text-gray-500 font-mono text-xs">
            10 hell-grade comics. Nano Banana 2 avatar & sprite generation studio.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
          <Video className="w-8 h-8 text-gray-400 mb-3" />
          <h3 className="text-xl font-bold text-gray-300 font-mono mb-2">SCARECROW VIDEO</h3>
          <p className="text-gray-500 font-mono text-xs">
            12 VHS and DVD horror classics. Veo cutscene engine for high-fidelity video generation.
          </p>
        </div>

        <div className="bg-yellow-950/30 border border-yellow-900 rounded-lg p-5">
          <Database className="w-8 h-8 text-yellow-500 mb-3" />
          <h3 className="text-xl font-bold text-yellow-500 font-mono mb-2">S6UL SPHERE 66</h3>
          <p className="text-gray-500 font-mono text-xs">
            Absolute memory database. Stores every NPC action, rating, and world event permanently.
          </p>
        </div>

        <div className="bg-orange-950/30 border border-orange-900 rounded-lg p-5">
          <Film className="w-8 h-8 text-orange-500 mb-3" />
          <h3 className="text-xl font-bold text-orange-500 font-mono mb-2">PUMPKIN CINEMA</h3>
          <p className="text-gray-500 font-mono text-xs">
            Giant pumpkin architecture. 12 Kopeland TV monitors. NPC movie ratings.
          </p>
        </div>

        <div className="bg-cyan-950/30 border border-cyan-900 rounded-lg p-5">
          <Users className="w-8 h-8 text-cyan-500 mb-3" />
          <h3 className="text-xl font-bold text-cyan-500 font-mono mb-2">12 AUTONOMOUS NPCs</h3>
          <p className="text-gray-500 font-mono text-xs">
            Sims-style AI. NPCs autonomously visit buildings, consume content, rate experiences.
          </p>
        </div>

        <div
          className="bg-green-950/20 border border-green-900 rounded-lg p-5 cursor-pointer transition-all hover:border-green-600 hover:bg-green-950/40 col-span-full"
          style={{ boxShadow: '0 0 0 transparent', transition: 'all 0.2s' }}
          onClick={() => navigate('ruin_core')}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 20px #00ff4120')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 transparent')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 flex items-center justify-center border-2"
                style={{ borderColor: '#00ff4160', background: '#001a00' }}
              >
                <Terminal className="w-7 h-7" style={{ color: '#00ff41' }} />
              </div>
              <div>
                <div style={{ color: '#00ff4160', fontSize: 9, letterSpacing: '0.2em', fontFamily: 'monospace' }}>
                  HAEZARIAN HOMEBREW DIVISION
                </div>
                <h3
                  className="text-2xl font-bold font-mono"
                  style={{ color: '#00ff41', textShadow: '0 0 12px #00ff4160', letterSpacing: '0.1em' }}
                >
                  RUIN-CORE ARCADE
                </h3>
                <p className="text-gray-500 font-mono text-xs mt-1">
                  Custom homebrew gaming vault. Satan's House & Trash Bound. EmulatorJS engine. Place ROMs in /public/roms/.
                </p>
              </div>
            </div>
            <div
              className="px-4 py-2 border font-bold font-mono text-sm tracking-widest transition-colors"
              style={{ borderColor: '#00ff4140', color: '#00ff41', background: '#001a00' }}
            >
              ENTER ARCADE →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArcadePlaceholder() {
  return (
    <div className="bg-gray-900 border border-blue-900 rounded-lg p-12 text-center">
      <Gamepad2 className="w-24 h-24 text-blue-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-blue-500 font-mono mb-4">THE ARCADE</h2>
      <p className="text-gray-500 font-mono mb-2">
        See the RUBILEXUS / PS4 tab for the Hell Sphere PS4 Core game system.
      </p>
      <p className="text-gray-600 font-mono text-sm mb-6">
        Full in-world arcade with NPC competitions coming to this node.
      </p>
      <div className="bg-black border border-blue-900 rounded p-6 max-w-md mx-auto">
        <h3 className="text-blue-400 font-mono font-bold mb-3">PLANNED FEATURES:</h3>
        <ul className="text-gray-500 font-mono text-sm text-left space-y-2">
          <li>• 20+ classic arcade games</li>
          <li>• High score leaderboards</li>
          <li>• NPC gaming competitions</li>
          <li>• Achievement system</li>
        </ul>
      </div>
    </div>
  );
}
