import React from 'react'; export default function App() { return ( <div style={{ backgroundColor: '#050505', color: '#ff0000', fontFamily: 'monospace', height: '100vh', padding: '10px', overflowY: 'auto' }}>
  <h2 style={{ borderBottom: '1px solid #ff0000' }}>HAEZARIAN WORLD SHELL [v6.6.6]</h2>
  
  {/* PERFORMANCE PILLARS (Twice Wing-Stage) */}
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
    <div style={{ border: '1px solid #440', padding: '10px', textAlign: 'center' }}>MOMO_WING [ACTIVE]</div>
    <div style={{ border: '1px solid #440', padding: '10px', textAlign: 'center' }}>JEONG_WING [ACTIVE]</div>
    <div style={{ border: '1px solid #440', padding: '10px', textAlign: 'center' }}>DAHYUN_WING [ACTIVE]</div>
  </div>

  {/* WORKSHOP ZONES */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
    <div style={{ border: '1px solid #ff0000', padding: '15px' }}>
      <h3>THE STABLE</h3> <p>Big Horse Records Domain</p>
    </div>
    <div style={{ border: '1px solid #ff0000', padding: '15px' }}>
      <h3>PUMPKIN CINEMA</h3> <p>Broadcast: RAW</p>
    </div>
    <div style={{ border: '1px solid #ff0000', padding: '15px' }}>
      <h3>MOWG ARCADE</h3> <p>Games / Store / UES</p>
    </div>
    <div style={{ border: '1px solid #ff0000', padding: '15px', backgroundColor: '#1a0000' }}>
      <h3>KAAPA TOERS</h3> <p>> DOWNLOAD APK VAULT</p>
    </div>
  </div>
</div> ); }
