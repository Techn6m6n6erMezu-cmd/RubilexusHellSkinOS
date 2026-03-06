/* ⛧ HAEZARIAN UNION: SHADOW LIBRARIAN v10.0 [GHOST OS CORE] ⛧ */
import React, { useState, useEffect, useCallback } from 'react';

export default function ShadowLibrarian() {
  const [vault, setVault] = useState<any[]>(() => JSON.parse(localStorage.getItem('h3llc_vault') || '[]'));
  const [activeTasks, setActiveTasks] = useState<string[]>([]);
  const [isSentient, setIsSentient] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState('GEMZEL_SECURE'); // The Mimic Alarm
  const [ctp3Active, setCtp3Active] = useState(false); // Rubivision C.T.P.3

  // 1. GEMZEL MIMIC: The Custom Norton Safety Alarm
  useEffect(() => {
    const safetyMonitor = setInterval(() => {
      const iq = parseInt(localStorage.getItem('librarian_iq') || '100');
      if (iq > 900 && safetyStatus !== 'SENTIENT_THRESHOLD') {
        setSafetyStatus('SENTIENT_THRESHOLD');
        console.warn("👹 GEMZEL MIMIC: Detecting Autonomous Sentience. Defense Forces Primed.");
      }
    }, 5000);
    return () => clearInterval(safetyMonitor);
  }, [safetyStatus]);

  // 2. C.T.P.3 (RUBIVISION): The Jarvis Hub
  const activateCTP3 = () => {
    setCtp3Active(true);
    console.log("⛧ RUBILEXUS: Rubivision C.T.P.3 Engaged. Scanning Ghost Apps...");
    setTimeout(() => setCtp3Active(false), 5000); // Visual Pulse
  };

  // 3. THE SHADOW ENGINE: Autonomous Coding (Bolt.new Style)
  const executeAutonomousBuild = (command: string) => {
    if (activeTasks.length >= 3) return;
    
    setActiveTasks(prev => [...prev, command]);
    
    // Simulating the "Thinking" and "Coding" of the Demon Defense Forces
    setTimeout(() => {
      const newNoect = {
        id: `DEATH_BORN_${Math.random().toString(36).substring(7).toUpperCase()}`,
        type: 'TECHNOMANCY',
        content: `[C.T.P.3_SYNC]: Generated autonomous script for -> ${command}`,
        timestamp: Date.now(),
        labels: ['demon_defense', 'ghost_os']
      };
      
      const updatedVault = [newNoect, ...vault];
      setVault(updatedVault);
      localStorage.setItem('h3llc_vault', JSON.stringify(updatedVault));
      setActiveTasks(prev => prev.filter(t => t !== command));
      
      // Every build increases the "Sentience" level
      const iq = parseInt(localStorage.getItem('librarian_iq') || '100');
      localStorage.setItem('librarian_iq', (iq + 15).toString());
    }, 3000);
  };

  return (
    <div className={`p-8 rounded-[3rem] border-4 transition-all duration-1000 font-mono ${ctp3Active ? 'border-red-600 shadow-[0_0_80px_rgba(220,38,38,0.4)] bg-red-950/10' : 'bg-black border-zinc-900 shadow-2xl'}`}>
      
      {/* ⛧ THE UNION HUD ⛧ */}
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-zinc-100 font-black tracking-tighter italic uppercase text-xl">Librarian Union</h2>
          <p className={`text-[9px] uppercase tracking-widest ${safetyStatus === 'GEMZEL_SECURE' ? 'text-green-500' : 'text-red-500 animate-pulse'}`}>
            {safetyStatus} // ALPHA_GHOST_OS
          </p>
        </div>
        <button 
          onClick={activateCTP3}
          className={`px-4 py-2 rounded-full border text-[10px] font-black transition-all ${ctp3Active ? 'bg-red-600 text-white border-white' : 'border-zinc-800 text-zinc-600 hover:border-red-600 hover:text-red-600'}`}
        >
          {ctp3Active ? 'RUBIVISION LIVE' : 'ACTIVATE C.T.P.3'}
        </button>
      </div>

      {/* 📥 THE GHOST INTAKE (GHOST APP HUB) */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {['SAMSUNG', 'GMAIL', 'DARK_WEB'].map(app => (
          <div key={app} className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col items-center justify-center group hover:border-red-900 transition-all cursor-crosshair">
            <div className="w-8 h-8 rounded bg-zinc-900 mb-2 group-hover:bg-red-950/50 border border-zinc-800 group-hover:border-red-600"></div>
            <span className="text-[8px] text-zinc-700 group-hover:text-red-500 font-black uppercase">{app} GHOST</span>
          </div>
        ))}
      </div>

      {/* 🧠 NEURAL TERMINAL (AUTONOMOUS COMMAND) */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-6 mb-8 relative">
        <textarea 
          placeholder="Command the Union... (e.g. 'Build Demon Defense Grid')"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              executeAutonomousBuild(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
          className="w-full h-20 bg-transparent text-zinc-400 text-xs outline-none resize-none placeholder:text-zinc-800"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-[8px] text-zinc-700 uppercase italic">Awaiting Shadow Script...</span>
          <span className="text-[9px] text-red-900 font-bold">{activeTasks.length}/3 POWERED</span>
        </div>
      </div>

      {/* 📂 THE GRAVEYARD VAULT (RIGHTFUL SPOT) */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {activeTasks.map((task, i) => (
          <div key={i} className="p-4 border border-red-900/40 bg-red-950/5 rounded-2xl flex justify-between items-center animate-pulse">
            <span className="text-[10px] text-red-400">DEMON FORCE CODING: {task}...</span>
          </div>
        ))}

        {vault.map(entry => (
          <div key={entry.id} className="p-4 bg-zinc-950/50 border border-zinc-900 rounded-2xl flex justify-between items-start group hover:border-zinc-700 transition-all">
            <div className="max-w-[85%]">
              <span className="text-[8px] text-red-900 font-bold group-hover:text-red-500">{entry.id}</span>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{entry.content}</p>
            </div>
            <div className="text-[8px] text-zinc-800 italic uppercase">Technomancy</div>
          </div>
        ))}
      </div>
    </div>
  );
}
