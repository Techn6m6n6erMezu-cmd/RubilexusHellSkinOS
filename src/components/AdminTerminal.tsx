import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Skull, Crown, Shield, Database, Cpu, HardDrive, Zap } from 'lucide-react';

type CommandOutput = {
  command: string;
  output: string;
  timestamp: string;
};

export function AdminTerminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addOutput('SYSTEM', `╔═══════════════════════════════════════════════════════════════╗
║           GIRA-SKULL ADMINISTRATIVE TERMINAL v3.14         ║
║              Master Control Interface - Level 9             ║
╚═══════════════════════════════════════════════════════════════╝

Terminal initialized: GIRA-SKULL
Security Level: MAXIMUM
Clearance: OMEGA
Type "help" for available commands`, 'info');
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const addOutput = (command: string, output: string, type: 'success' | 'error' | 'info' = 'success') => {
    const timestamp = new Date().toLocaleTimeString();
    setHistory(prev => [...prev, { command, output: type === 'info' ? output : `[${type.toUpperCase()}] ${output}`, timestamp }]);
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output = '';

    switch (trimmedCmd) {
      case 'help':
        output = `Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  help              Show this help message
  status            Display complete system status
  districts         Performance district management
  assets            Asset database management
  sessions          Terminal session logs
  export            Application export controls
  drive             Daemoni Drive integration
  security          Security & encryption status
  analytics         System analytics dashboard
  backup            Backup & recovery systems
  clear             Clear terminal output
  reboot            Restart terminal interface
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        addOutput(cmd, output, 'info');
        break;

      case 'status':
        output = `System Status Report:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Terminal: GIRA-SKULL
  Security Level: OMEGA CLEARANCE
  Status: FULLY OPERATIONAL
  Uptime: 99.99%

  Core Systems:
    ✓ District Network: ACTIVE
    ✓ Citizen Registry: SYNCHRONIZED
    ✓ Asset Management: ONLINE
    ✓ Encryption Layer: ENABLED
    ✓ Backup Systems: RUNNING
    ✓ Analytics Engine: PROCESSING

  Network Status:
    Districts Online: 7/7
    Active Sessions: 142
    Data Integrity: 100%

  Last Sync: ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        addOutput(cmd, output, 'success');
        break;

      case 'districts':
        output = `Performance Districts Management:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DISTRICT-001: North American Sector
    Target FPS: 60 | Quality: ULTRA | Status: OPTIMAL
    Citizens: 45,231 | Load: 67%

  DISTRICT-002: European Coalition
    Target FPS: 60 | Quality: HIGH | Status: OPTIMAL
    Citizens: 38,942 | Load: 54%

  DISTRICT-003: Asian Pacific Zone
    Target FPS: 60 | Quality: HIGH | Status: OPTIMAL
    Citizens: 62,108 | Load: 71%

  DISTRICT-004: African Federation
    Target FPS: 45 | Quality: MEDIUM | Status: STABLE
    Citizens: 28,445 | Load: 48%

  DISTRICT-005: South American Territory
    Target FPS: 60 | Quality: HIGH | Status: OPTIMAL
    Citizens: 31,267 | Load: 59%

  DISTRICT-006: Middle Eastern Domain
    Target FPS: 60 | Quality: ULTRA | Status: OPTIMAL
    Citizens: 22,893 | Load: 42%

  DISTRICT-007: Oceanic Region
    Target FPS: 60 | Quality: HIGH | Status: OPTIMAL
    Citizens: 15,778 | Load: 38%

  Total Active Citizens: 244,664
  Average System Load: 54%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        addOutput(cmd, output, 'success');
        break;

      case 'assets':
        output = `Asset Management System:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total Assets Registered: 15,847
  Storage Backend: Daemoni Drive (Google Drive)
  Hash Algorithm: SHA-256
  Integrity Status: VERIFIED

  Asset Categories:
    Real Estate Holdings:     8,423
    Resource Allocations:     3,291
    Digital Assets:           2,847
    Infrastructure Rights:      982
    Territory Claims:           304

  Recent Activity:
    Uploads (24h): 156
    Downloads (24h): 892
    Verifications: 15,847/15,847
    Hash Collisions: 0

  Storage Utilization:
    Total Capacity: 2.4 TB
    Used Space: 1.8 TB (75%)
    Available: 600 GB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        addOutput(cmd, output, 'success');
        break;

      case 'sessions':
        output = `Terminal Session Logs:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Current Session: ${Math.random().toString(36).substring(2, 10).toUpperCase()}
  Session Start: ${new Date().toLocaleString()}
  Commands Executed: ${history.length}

  Recent Sessions (Last 5):

  1. ${new Date(Date.now() - 3600000).toLocaleString()}
     Terminal: GIRA-SKULL | Commands: 47 | Duration: 2h 14m

  2. ${new Date(Date.now() - 7200000).toLocaleString()}
     Terminal: GIRA-SKULL | Commands: 23 | Duration: 1h 05m

  3. ${new Date(Date.now() - 86400000).toLocaleString()}
     Terminal: RUBILEXUS | Commands: 156 | Duration: 4h 32m

  4. ${new Date(Date.now() - 172800000).toLocaleString()}
     Terminal: GIRA-SKULL | Commands: 89 | Duration: 3h 18m

  5. ${new Date(Date.now() - 259200000).toLocaleString()}
     Terminal: GIRA-SKULL | Commands: 34 | Duration: 1h 47m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        addOutput(cmd, output, 'success');
        break;

      case 'export':
        output = `Application Export System:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Export Framework: Capacitor.js v8.1.0
  Status: READY

  Supported Platforms:
    ✓ iOS (Native)
    ✓ Android (Native)
    ✓ Progressive Web App

  Export Options:
    • Production Builds
    • Development Builds
    • Debug Builds
    • Release Signing

  Recent Exports:
    iOS v1.2.3 - 2 days ago
    Android v1.2.3 - 2 days ago
    PWA v1.2.4 - 6 hours ago

  Usage: export [platform] [app-name] [version]
  Example: export ios satans-world 1.3.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        addOutput(cmd, output, 'info');
        break;

      case 'drive':
        output = `Daemoni Drive Integration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Provider: Google Drive API v3
  Status: CONNECTED
  Authentication: OAuth 2.0

  Configuration:
    ✓ Auto-hash Generation: ENABLED
    ✓ Metadata Tracking: ACTIVE
    ✓ Version Control: ENABLED
    ✓ Encryption at Rest: ACTIVE

  Operations:
    Upload Speed: 125 MB/s
    Download Speed: 180 MB/s
    Sync Interval: 5 minutes
    Last Sync: ${new Date().toLocaleTimeString()}

  Commands:
    drive sync   - Synchronize all assets
    drive upload - Upload new assets
    drive list   - List all stored assets
    drive verify - Verify hash integrity
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        addOutput(cmd, output, 'info');
        break;

      case 'security':
        output = `Security & Encryption Status:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Security Level: OMEGA CLEARANCE
  Encryption: AES-256 + RSA-4096
  Hash Function: SHA-256

  Active Security Measures:
    ✓ End-to-End Encryption
    ✓ Multi-Factor Authentication
    ✓ Biometric Verification
    ✓ Zero-Knowledge Architecture
    ✓ Blockchain Verification
    ✓ Quantum-Resistant Algorithms

  Access Control:
    Active Sessions: 142
    Failed Login Attempts: 0
    Suspicious Activity: NONE
    Firewall Status: ENABLED

  Audit & Compliance:
    Last Security Audit: 7 days ago
    Vulnerabilities Found: 0
    Patches Applied: 100%
    Compliance Score: 100/100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        addOutput(cmd, output, 'success');
        break;

      case 'analytics':
        output = `System Analytics Dashboard:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Real-time Metrics (Last 24 Hours):

  User Activity:
    Active Citizens: 244,664
    New Registrations: 1,847
    Session Duration (avg): 3h 42m
    Commands Executed: 1,247,892

  System Performance:
    CPU Usage: 54%
    Memory Usage: 67%
    Disk I/O: 3.2 GB/s
    Network Traffic: 12.4 TB

  District Performance:
    Average FPS: 58.7
    Render Quality: 94%
    Load Distribution: BALANCED
    Error Rate: 0.02%

  Asset Operations:
    Uploads: 8,423
    Downloads: 34,281
    Verifications: 156,847
    Storage Growth: +47 GB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        addOutput(cmd, output, 'success');
        break;

      case 'backup':
        output = `Backup & Recovery Systems:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Backup Strategy: 3-2-1 (Three copies, Two media, One offsite)
  Status: OPERATIONAL

  Scheduled Backups:
    Full Backup: Daily at 03:00 UTC
    Incremental: Every 6 hours
    Last Full Backup: 18 hours ago
    Last Incremental: 2 hours ago

  Backup Locations:
    ✓ Primary: Daemoni Drive (Google)
    ✓ Secondary: AWS S3 (Encrypted)
    ✓ Tertiary: Local RAID Array

  Recovery Metrics:
    RPO (Recovery Point): < 6 hours
    RTO (Recovery Time): < 2 hours
    Last Recovery Test: 14 days ago
    Test Result: SUCCESS

  Data Integrity:
    Checksum Verification: 100%
    Corruption Detected: NONE
    Redundancy Level: TRIPLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        addOutput(cmd, output, 'success');
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'reboot':
        addOutput(cmd, 'Initiating terminal reboot sequence...', 'info');
        setTimeout(() => {
          setHistory([]);
          addOutput('SYSTEM', `╔═══════════════════════════════════════════════════════════════╗
║           GIRA-SKULL ADMINISTRATIVE TERMINAL v3.14         ║
║              Master Control Interface - Level 9             ║
╚═══════════════════════════════════════════════════════════════╝

Terminal reinitialized: GIRA-SKULL
All systems restored
Type "help" for available commands`, 'info');
        }, 1000);
        return;

      case '':
        return;

      default:
        output = `Command not recognized: "${cmd}"\nType "help" for available commands`;
        addOutput(cmd, output, 'error');
    }

    setCommandHistory(prev => [...prev, cmd]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-black text-blue-400 font-mono">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6 border-b border-blue-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-blue-500" />
              <Skull className="w-4 h-4 text-red-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-blue-300">GIRA-SKULL TERMINAL</h1>
              <p className="text-sm text-blue-700">Administrative Command Interface - OMEGA CLEARANCE</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-500">SECURED</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <button
            onClick={() => executeCommand('status')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-950 border border-blue-900 hover:bg-blue-900 transition-colors"
          >
            <Cpu className="w-4 h-4" />
            <span className="text-xs">STATUS</span>
          </button>
          <button
            onClick={() => executeCommand('districts')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-950 border border-blue-900 hover:bg-blue-900 transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span className="text-xs">DISTRICTS</span>
          </button>
          <button
            onClick={() => executeCommand('assets')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-950 border border-blue-900 hover:bg-blue-900 transition-colors"
          >
            <Database className="w-4 h-4" />
            <span className="text-xs">ASSETS</span>
          </button>
          <button
            onClick={() => executeCommand('analytics')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-950 border border-blue-900 hover:bg-blue-900 transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span className="text-xs">ANALYTICS</span>
          </button>
        </div>

        <div className="bg-black border border-blue-900 rounded-lg overflow-hidden shadow-2xl shadow-blue-900/20">
          <div
            ref={outputRef}
            className="h-[60vh] overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-black"
          >
            {history.map((item, i) => (
              <div key={i} className="mb-3">
                {item.command !== 'SYSTEM' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-blue-700 text-xs">[{item.timestamp}]</div>
                    <div className="text-blue-500">
                      {'>'} {item.command}
                    </div>
                  </div>
                )}
                <pre className="text-blue-400 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {item.output}
                </pre>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-blue-900 p-4 flex items-center gap-2 bg-blue-950/20">
            <span className="text-blue-600">{'>'}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-blue-400 placeholder-blue-900 font-mono"
              placeholder="Enter command..."
              autoFocus
            />
          </form>
        </div>

        <div className="mt-4 text-xs text-blue-900 text-center">
          Press ↑/↓ for command history • Type 'help' for commands • OMEGA CLEARANCE ACTIVE
        </div>
      </div>
    </div>
  );
}
