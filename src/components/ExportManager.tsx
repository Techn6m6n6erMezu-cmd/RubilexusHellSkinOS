import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Download, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

type AppExport = {
  id: string;
  name: string;
  platform: 'ios' | 'android' | 'web';
  config: Record<string, any>;
  exported_at: string;
  build_status: 'pending' | 'building' | 'completed' | 'failed';
};

export function ExportManager() {
  const [exports, setExports] = useState<AppExport[]>([]);
  const [showExportForm, setShowExportForm] = useState(false);
  const [exportName, setExportName] = useState('');
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExports();
  }, []);

  const loadExports = async () => {
    const { data } = await supabase
      .from('app_exports')
      .select('*')
      .order('exported_at', { ascending: false });

    if (data) {
      setExports(data);
    }
  };

  const createExport = async () => {
    if (!exportName.trim()) return;

    setLoading(true);
    try {
      const user = await supabase.auth.getUser();

      const { error } = await supabase
        .from('app_exports')
        .insert({
          name: exportName,
          platform,
          exported_by: user.data.user?.id,
          config: {
            capacitor_enabled: platform !== 'web',
            target_fps: 60,
            optimizations: true,
          },
          build_status: 'pending',
        });

      if (!error) {
        await loadExports();
        setExportName('');
        setShowExportForm(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios':
      case 'android':
        return <Smartphone className="w-5 h-5" />;
      case 'web':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Download className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-950 border-green-800';
      case 'building':
        return 'text-yellow-500 bg-yellow-950 border-yellow-800';
      case 'failed':
        return 'text-red-500 bg-red-950 border-red-800';
      default:
        return 'text-gray-500 bg-gray-950 border-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">App Export Forge</h2>
          <p className="text-gray-500 text-sm">Package standalone experiences with Capacitor.js</p>
        </div>
        <button
          onClick={() => setShowExportForm(!showExportForm)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
        >
          New Export
        </button>
      </div>

      {showExportForm && (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-300 mb-4">Create New Export</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">App Name</label>
              <input
                type="text"
                value={exportName}
                onChange={(e) => setExportName(e.target.value)}
                placeholder="My Haezarian App"
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Target Platform</label>
              <div className="grid grid-cols-3 gap-3">
                {(['web', 'ios', 'android'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`flex items-center justify-center gap-2 p-3 rounded border ${
                      platform === p
                        ? 'bg-red-900 border-red-600 text-red-100'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {getPlatformIcon(p)}
                    <span className="capitalize">{p}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={createExport}
                disabled={loading || !exportName.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white py-2 rounded font-medium transition-colors"
              >
                {loading ? 'Creating...' : 'Create Export'}
              </button>
              <button
                onClick={() => setShowExportForm(false)}
                className="px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <h3 className="font-semibold text-gray-300">Export History</h3>
        </div>

        {exports.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No exports yet. Create your first app export above.
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {exports.map((exp) => (
              <div key={exp.id} className="p-4 hover:bg-gray-900 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-red-500 mt-1">
                      {getPlatformIcon(exp.platform)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-300">{exp.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Platform: {exp.platform.toUpperCase()} • {new Date(exp.exported_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded border text-xs font-medium ${getStatusColor(exp.build_status)}`}>
                    {exp.build_status === 'building' && <Loader className="w-3 h-3 inline mr-1 animate-spin" />}
                    {exp.build_status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-gray-950 border border-gray-800 rounded-lg p-4">
        <h3 className="font-semibold text-gray-300 mb-2">Capacitor.js Integration</h3>
        <div className="text-sm text-gray-500 space-y-1">
          <div>• Native mobile wrapping enabled for iOS and Android</div>
          <div>• App-in-App export functionality ready</div>
          <div>• Performance optimized for mobile hardware</div>
          <div>• Standalone PWA support for web exports</div>
        </div>
      </div>
    </div>
  );
}
