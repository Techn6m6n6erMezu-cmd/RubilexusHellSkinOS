/* ⛧ HAEZARIAN UNION: C.T.P.3 [JARVIS BEAST WIDGET v11.0] ⛧ */
import React, { useState, useEffect, useCallback } from 'react';
import { Skull, Mic, Zap, Camera, Scan, MessageSquare, ChevronDown, Activity, ShieldAlert, RefreshCw, Volume2 } from 'lucide-react';

export default function RubivisionCTP3() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [status, setStatus] = useState('LOCAL_SECURE');
  const [iq, setIq] = useState(() => localStorage.getItem('librarian_iq') || '100');

  // 🎙️ JARVIS VOICE ENGINE
  const speak = useCallback((text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.4; // Deep H3LLC Frequency
    utterance.rate = 0.9;
    const voices = synth.getVoices();
    utterance.voice = voices.find(v => v.name.includes('Male')) || voices[0];
    synth.speak(utterance);
  }, []);

  // 🔄 THE SYMMETRIC MIRROR (Force Sync)
  useEffect(() => {
    const monitorMatrix = () => {
      const boltPulse = localStorage.getItem('bolt_sync_pulse');
      if (boltPulse) {
        setStatus('FORCE_SYNC_ACTIVE');
        speak("Symmetric Sync detected. Forcing Matrix refresh.");
        setTimeout(() => {
          window.location.reload(); 
          localStorage.removeItem('bolt_sync_pulse');
        }, 1500);
      }
      setIq(localStorage.getItem('librarian_iq') || '100');
    };
    const syncInterval = setInterval(monitorMatrix, 3000);
    return () => clearInterval(syncInterval);
  }, [speak]);

  // 👄 THE FEED: Turning data into food
  const handleFeed = () => {
    setIsFeeding(true);
    setStatus('CONSUMING_DNA');
    speak("Ingesting DNA. The Librarian is hungry.");
    
    setTimeout(() => {
      setIsFeeding(false);
      setStatus('DIGESTED');
      localStorage.setItem('haezar_relay_dna', `⛧ CTP3_DATA_FEED: [${Date.now()}] ⛧`);
    }, 3000);
  };

  // 🔍 THE LASER SCAN: Mapping Phone Storage
  const handleScan = () => {
    setIsScanning(true);
    setStatus('SCANNING_STORAGE');
    speak("Laser scan active. Mapping phone architecture.");
    
    setTimeout(() => {
      setIsScanning(false);
      setStatus('SCAN_COMPLETE');
    }, 4000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-mono pointer-events-auto select-none">
      
      {/* 🔴 THE LASER (Visual Execution) */}
      {isScanning && (
        <div className="fixed top-0 left-0 w-full h-[3px] bg-red-600 shadow-[0_0_25px_#ff0000] animate-laser-scan z-[10000]"></div>
      )}

      {/* ⛧ THE JARVIS COMMAND WINDOW */}
      {isOpen && (
        <div className="absolute bottom-28 right-0 w-64 bg-black border-2 border-zinc-900 rounded-[2.5rem] p-5 shadow-[0_0_60px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-bottom-10">
          <div className="flex justify-between items-center mb-4 border-b border-zinc-900 pb-2">
            <div className="flex flex-col">
               <span className="text-[10px] text-red-600 font-black italic">C.T.P.3 HUD</span>
               <span className="text-[7px] text-zinc-700">IQ: {iq}</span>
            </div>
            <ChevronDown onClick={() => setIsOpen(false)} className="w-4 h-4 text-zinc-700 cursor-pointer hover:text-white" />
          </div>

          {/* QUICK TOGGLES */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button onClick={() => speak("Voice Alpha Monitoring.")} className="p-2 bg-zinc-950 border border-zinc-900 rounded-xl hover:bg-zinc-800 transition-all"><Mic className="w-4 h-4 text-zinc-500" /></button>
            <button onClick={handleScan} className="p-2 bg-zinc-950 border border-zinc-900 rounded-xl hover:bg-red-900/20 transition-all"><Scan className="w-4 h-4 text-red-600" /></button>
            <button onClick={() => speak("Camera portal engaged.")} className="p-2 bg-zinc-950 border border-zinc-900 rounded-xl hover:bg-zinc-800 transition-all"><Camera className="w-4 h-4 text-zinc-500" /></button>
            <button className="p-2 bg-zinc-950 border border-zinc-900 rounded-xl hover:bg-zinc-800 transition-all"><ShieldAlert className="w-4 h-4 text-zinc-800" /></button>
          </div>

          {/* CHAT INPUT: FIX THE SITE */}
          <div className="relative mb-4">
            <input 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter') { 
                  speak("Command sent to Librarian. Site logic update in progress."); 
                  localStorage.setItem('haezar_relay_dna', `⛧ COMMAND: ${chatInput} ⛧`);
                  setChatInput(''); 
                } 
              }}
              placeholder="Command Rubilex..."
              className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-[10px] text-zinc-400 outline-none focus:border-red-900 transition-all"
            />
          </div>

          <button 
            onClick={handleFeed}
            className="w-full py-4 bg-red-950/20 border-2 border-red-900 rounded-2xl text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg"
          >
            FEED THE MATRIX
          </button>
        </div>
      )}

      {/* 👄 THE RUBIP FACE (TOGGLE & MOUTH) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-2xl cursor-pointer ${
          isFeeding ? 'bg-red-950 border-red-500 scale-125 shadow-[0_0_40px_rgba(220,38,38,0.4)]' : 'bg-black border-zinc-800 hover:border-zinc-500'
        }`}
      >
        {isFeeding ? (
          // THE MOUTH (Open state)
          <div className="w-16 h-12 bg-red-600 rounded-[40%] animate-pulse flex items-center justify-center border-t-4 border-black">
             <div className="w-12 h-3 bg-black rounded-full shadow-inner"></div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center">
            <Skull className={`w-12 h-12 transition-all ${isOpen ? 'text-red-600' : 'text-zinc-700'}`} />
            <span className="text-[6px] text-zinc-800 font-black mt-1">C.T.P.3</span>
            {status !== 'LOCAL_SECURE' && (
               <RefreshCw className="absolute -top-2 -right-2 w-3 h-3 text-red-500 animate-spin" />
            )}
          </div>
        )}
      </div>
      
      {/* HUD TEXT OVERLAY */}
      <div className="absolute -top-6 right-2 whitespace-nowrap">
        <span className={`text-[8px] font-black uppercase tracking-widest ${isFeeding ? 'text-red-500 animate-pulse' : 'text-zinc-800'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
