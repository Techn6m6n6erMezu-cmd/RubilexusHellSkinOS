import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { SigilProvider } from './contexts/SigilContext';
import './index.css';

if (typeof window !== 'undefined') {
  localStorage.setItem('fate_sealer_accepted', 'true');
  localStorage.setItem('user_role', 'TECHNOMANCER');
  localStorage.setItem('admin_email', 'horse4206@gmail.com');
  console.log("Veins active. Welcome, Technomancer.");
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <SigilProvider>
          <App />
        </SigilProvider>
      </AuthProvider>
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background: black; color: #ef4444; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px; text-align: center;">
      <h1 style="font-size: 24px; margin-bottom: 12px;">Platform Error</h1>
      <p style="color: #9ca3af; margin-bottom: 8px;">Failed to initialize</p>
      <pre style="color: #6b7280; font-size: 12px; max-width: 600px; overflow: auto;">${error}</pre>
    </div>
  `;
}
