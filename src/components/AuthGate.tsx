import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Crown } from 'lucide-react';
import SigilMark from './SigilMark';

export function AuthGate() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terminalName, setTerminalName] = useState('');
  const [role, setRole] = useState<'master' | 'guardian'>('master');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_PASS = 'haezarian_access_2026';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = mode === 'signin'
        ? await signIn(email, ADMIN_PASS)
        : await signUp(email, password, terminalName, role);

      if (result.error) {
        setError(result.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SigilMark size={64} color="#dc2626" />
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Haezarian Platform
          </h1>
          <p className="text-gray-500 text-sm">Admin Terminal Access</p>
        </div>

        <div className="bg-gray-900 border border-red-900 rounded-lg p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 px-4 rounded ${
                mode === 'signin'
                  ? 'bg-red-900 text-red-100'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded ${
                mode === 'signup'
                  ? 'bg-red-900 text-red-100'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-red-600 focus:outline-none"
                required
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-red-600 focus:outline-none"
                  required
                />
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Terminal Name</label>
                  <input
                    type="text"
                    value={terminalName}
                    onChange={(e) => setTerminalName(e.target.value)}
                    placeholder="e.g., Rubilexus or Gira-Skull"
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Admin Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('master')}
                      className={`flex items-center justify-center gap-2 p-3 rounded border ${
                        role === 'master'
                          ? 'bg-red-900 border-red-600 text-red-100'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <Crown className="w-4 h-4" />
                      Master
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('guardian')}
                      className={`flex items-center justify-center gap-2 p-3 rounded border ${
                        role === 'guardian'
                          ? 'bg-red-900 border-red-600 text-red-100'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      Guardian
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-950 border border-red-800 rounded p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white py-2 rounded font-medium transition-colors"
            >
              {loading ? 'Processing...' : mode === 'signin' ? 'Access Terminal' : 'Initialize Terminal'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Secure command-line interface for haezarian platform administration
        </p>
      </div>
    </div>
  );
}
