import { useState } from 'react';
import { Smartphone, Shield, CheckCircle2, Copy, Download, ChevronDown, ChevronRight } from 'lucide-react';

const PERMISSIONS = [
  { name: 'SYSTEM_ALERT_WINDOW', level: 'SIGNATURE', desc: 'Float avatar & PiP overlay above all apps', critical: true },
  { name: 'FOREGROUND_SERVICE', level: 'NORMAL', desc: 'Keep TOLB engine running in background', critical: true },
  { name: 'MANAGE_EXTERNAL_STORAGE', level: 'DANGEROUS', desc: 'Terabyte Food ingestion — full storage access', critical: true },
  { name: 'RECEIVE_BOOT_COMPLETED', level: 'NORMAL', desc: 'Auto-start Haezarian Core on device boot', critical: false },
  { name: 'INTERNET', level: 'NORMAL', desc: 'Supabase sync & Ghost Vault connection', critical: false },
  { name: 'VIBRATE', level: 'NORMAL', desc: 'Rupivision Call haptic feedback', critical: false },
  { name: 'REQUEST_INSTALL_PACKAGES', level: 'SIGNATURE', desc: 'APK self-update from TOLB manifest', critical: false },
  { name: 'USE_BIOMETRIC', level: 'NORMAL', desc: 'Fate Sealer biometric gate', critical: false },
];

const MANIFEST_XML = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.haezarian.hellskinos"
    android:versionCode="666"
    android:versionName="6.6.6-HELLSKIN">

    <!-- HAEZARIAN CORE PERMISSIONS -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />

    <application
        android:name=".HaezarianApp"
        android:allowBackup="false"
        android:hardwareAccelerated="true"
        android:label="HELLSKIN OS"
        android:supportsRtl="false"
        android:theme="@style/HaezarianDark"
        android:usesCleartextTraffic="false">

        <!-- MAIN ACTIVITY -->
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize">
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- TOLB FOREGROUND SERVICE -->
        <service
            android:name=".services.TOLBBackgroundService"
            android:foregroundServiceType="dataSync"
            android:exported="false" />

        <!-- RUPIP PiP OVERLAY SERVICE -->
        <service
            android:name=".services.RupipOverlayService"
            android:exported="false" />

        <!-- BOOT RECEIVER -->
        <receiver
            android:name=".receivers.BootReceiver"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>

    </application>

</manifest>`;

const CAPACITOR_CONFIG = `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.haezarian.hellskinos',
  appName: 'HELLSKIN OS',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 666,
      backgroundColor: '#000000',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#000000',
    },
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;`;

const LEVEL_COLORS: Record<string, string> = {
  NORMAL: '#22c55e',
  DANGEROUS: '#ef4444',
  SIGNATURE: '#f59e0b',
};

export default function HaezarianAPKConfig() {
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>('manifest');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="min-h-screen font-mono" style={{ background: '#030303', color: '#888' }}>
      <div className="border-b px-4 py-4" style={{ borderColor: '#111', background: '#050505' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5" style={{ color: '#555' }} />
            <div>
              <h1 className="font-bold tracking-widest" style={{ color: '#aaa', fontSize: 16, letterSpacing: '0.2em' }}>
                HAEZARIAN APK
              </h1>
              <div style={{ color: '#333', fontSize: 8, letterSpacing: '0.15em' }}>
                ANDROID MANIFEST v6.6.6 • CAPACITOR BRIDGE • SYSTEM-LEVEL PERMISSIONS
              </div>
            </div>
          </div>
          <div className="text-right">
            <div style={{ color: '#555', fontSize: 11, fontWeight: 'bold' }}>v6.6.6</div>
            <div style={{ color: '#333', fontSize: 7 }}>HELLSKIN OS</div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-3">
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: '#1a1a1a', background: '#070707' }}>
          <div className="flex items-center gap-3 p-3 border-b" style={{ borderColor: '#111' }}>
            <Shield className="w-4 h-4" style={{ color: '#f59e0b' }} />
            <span className="font-bold tracking-widest" style={{ color: '#aaa', fontSize: 10 }}>ANDROID PERMISSIONS</span>
            <span style={{ color: '#333', fontSize: 8, marginLeft: 'auto' }}>{PERMISSIONS.length} TOTAL</span>
          </div>
          <div className="divide-y" style={{ borderColor: '#0f0f0f' }}>
            {PERMISSIONS.map(p => (
              <div key={p.name} className="flex items-center gap-3 px-3 py-2.5">
                <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: p.critical ? '#ef444460' : '#22c55e40' }} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono" style={{ color: p.critical ? '#ef4444' : '#666', fontSize: 9, letterSpacing: '0.05em' }}>
                    {p.name}
                  </div>
                  <div style={{ color: '#333', fontSize: 7 }}>{p.desc}</div>
                </div>
                <div
                  className="px-1.5 py-0.5 rounded text-center"
                  style={{
                    background: `${LEVEL_COLORS[p.level]}15`,
                    border: `1px solid ${LEVEL_COLORS[p.level]}30`,
                    color: LEVEL_COLORS[p.level],
                    fontSize: 7,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.level}
                </div>
              </div>
            ))}
          </div>
        </div>

        {[
          { key: 'manifest', label: 'AndroidManifest.xml', code: MANIFEST_XML, color: '#3b82f6' },
          { key: 'capacitor', label: 'capacitor.config.ts', code: CAPACITOR_CONFIG, color: '#22c55e' },
        ].map(({ key, label, code, color }) => (
          <div key={key} className="rounded-lg border overflow-hidden" style={{ borderColor: '#1a1a1a', background: '#070707' }}>
            <button
              onClick={() => setExpanded(expanded === key ? null : key)}
              className="w-full flex items-center gap-3 p-3 text-left hover:opacity-90 transition-opacity border-b"
              style={{ borderColor: '#111' }}
            >
              {expanded === key
                ? <ChevronDown className="w-3.5 h-3.5" style={{ color }} />
                : <ChevronRight className="w-3.5 h-3.5" style={{ color: '#444' }} />
              }
              <span className="flex-1 font-mono" style={{ color: expanded === key ? color : '#666', fontSize: 10 }}>{label}</span>
              <button
                onClick={e => { e.stopPropagation(); copyToClipboard(code, key); }}
                className="flex items-center gap-1 px-2 py-0.5 rounded border transition-opacity hover:opacity-80"
                style={{ borderColor: `${color}30`, color: `${color}70`, fontSize: 7 }}
              >
                {copied === key ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                {copied === key ? 'COPIED' : 'COPY'}
              </button>
            </button>
            {expanded === key && (
              <pre
                className="overflow-x-auto p-4 text-xs"
                style={{
                  color: '#555',
                  fontSize: 8,
                  lineHeight: 1.7,
                  background: '#020202',
                  maxHeight: 320,
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  whiteSpace: 'pre',
                  wordBreak: 'keep-all',
                }}
              >
                {code}
              </pre>
            )}
          </div>
        ))}

        <div className="rounded-lg border p-4" style={{ borderColor: '#1a1a1a', background: '#070707' }}>
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-3.5 h-3.5" style={{ color: '#555' }} />
            <span className="font-bold tracking-widest" style={{ color: '#777', fontSize: 10 }}>BUILD STEPS</span>
          </div>
          <div className="space-y-2">
            {[
              { n: 1, cmd: 'npm run build', note: 'Compile Vite dist' },
              { n: 2, cmd: 'npx cap sync android', note: 'Sync web assets to Android' },
              { n: 3, cmd: 'npx cap open android', note: 'Open in Android Studio' },
              { n: 4, cmd: 'Build → Generate Signed APK', note: 'Sign with Haezarian keystore' },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-3">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-center shrink-0" style={{ background: '#1a1a1a', color: '#555', fontSize: 7 }}>{s.n}</span>
                <div>
                  <code style={{ color: '#22c55e', fontSize: 9 }}>{s.cmd}</code>
                  <div style={{ color: '#333', fontSize: 7 }}>{s.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-3" style={{ color: '#1a1a1a', fontSize: 7, letterSpacing: '0.2em' }}>
          HAEZARIAN APK — PROPERTY OF RYAN J. CORTRIGHT (LUCIE FOREBS) & JOHN AARON SLONE • S6UL SPHERE 66
        </div>
      </div>
    </div>
  );
}
