import { useState, useEffect } from 'react';
import { FileText, Search, ExternalLink, Plus, Trash2, Lock, Clock, Hash } from 'lucide-react';
import {
  silentPatent,
  getAllPatents,
  searchPatents,
  deletePatent,
  linkPatentToDrive,
  type PatentData,
} from '../services/patentService';

export default function PatentManager() {
  const [patents, setPatents] = useState<PatentData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [assetName, setAssetName] = useState('');
  const [content, setContent] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    loadPatents();
  }, []);

  const loadPatents = async () => {
    setLoading(true);
    const data = await getAllPatents();
    setPatents(data);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadPatents();
      return;
    }
    setLoading(true);
    const results = await searchPatents(searchTerm);
    setPatents(results);
    setLoading(false);
  };

  const handleCreatePatent = async () => {
    if (!assetName.trim()) {
      alert('Asset name is required');
      return;
    }

    const patentContent = {
      raw: content,
      type: 'manual_entry',
      created_via: 'Patent Manager UI',
    };

    await silentPatent(assetName, patentContent, {
      driveUrl: driveUrl || undefined,
      isPublic,
    });

    // Reset form
    setAssetName('');
    setContent('');
    setDriveUrl('');
    setIsPublic(false);
    setShowCreateForm(false);

    // Reload patents
    loadPatents();
  };

  const handleDelete = async (ghostCode: string) => {
    if (confirm('Delete this patent from Daemoni Drive?')) {
      await deletePatent(ghostCode);
      loadPatents();
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold text-yellow-500 font-mono">
              DAEMONI DRIVE
            </h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">
            Silent Patenting v1.0 - Asset Protection System
          </p>
          <p className="text-red-600 font-mono text-xs mt-1">
            PROJECT: TRASH BOUND / SATAN'S HOUSE
          </p>
        </div>

        {/* Search & Create Bar */}
        <div className="bg-gray-900 border border-gray-800 p-4 rounded mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search patents by asset name..."
                className="flex-1 bg-black border border-gray-700 px-4 py-2 rounded text-gray-200 focus:outline-none focus:border-yellow-500 font-mono"
              />
              <button
                onClick={handleSearch}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded border border-gray-700 flex items-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded font-bold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Patent
            </button>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div className="border-t border-gray-800 pt-4 mt-4">
              <h3 className="text-yellow-500 font-mono mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Create New Patent
              </h3>
              <div className="grid gap-3">
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="Asset Name *"
                  className="bg-black border border-gray-700 px-4 py-2 rounded text-gray-200 focus:outline-none focus:border-yellow-500 font-mono"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Content / Description"
                  rows={4}
                  className="bg-black border border-gray-700 px-4 py-2 rounded text-gray-200 focus:outline-none focus:border-yellow-500 font-mono resize-none"
                />
                <input
                  type="text"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="Google Docs / Notepad URL (optional)"
                  className="bg-black border border-gray-700 px-4 py-2 rounded text-gray-200 focus:outline-none focus:border-yellow-500 font-mono"
                />
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-mono text-sm">Make patent public</span>
                </label>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded border border-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePatent}
                    className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded font-bold transition-colors"
                  >
                    Secure Patent
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Patent Count */}
        <div className="text-gray-500 font-mono text-sm mb-4">
          {loading ? 'Loading...' : `${patents.length} patent${patents.length !== 1 ? 's' : ''} found`}
        </div>

        {/* Patents List */}
        <div className="space-y-4">
          {patents.map((patent) => (
            <div
              key={patent.ghost_code}
              className="bg-gray-900 border border-gray-800 rounded p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-yellow-500 mb-1 font-mono">
                    {patent.asset_name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(patent.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {patent.ghost_code.substring(0, 12)}...
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(patent.ghost_code)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                  title="Delete Patent"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-black border border-gray-800 p-3 rounded mb-3">
                <div className="text-gray-400 text-sm font-mono mb-2">
                  <strong className="text-red-500">OWNER:</strong> {patent.owner}
                </div>
                <div className="text-gray-400 text-sm font-mono mb-2">
                  <strong className="text-red-500">PROJECT:</strong> {patent.project}
                </div>
                {patent.content && (
                  <div className="text-gray-500 text-sm font-mono mt-2 pt-2 border-t border-gray-800">
                    {typeof patent.content === 'object'
                      ? JSON.stringify(patent.content, null, 2)
                      : patent.content}
                  </div>
                )}
              </div>

              {patent.drive_url && (
                <a
                  href={patent.drive_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View in Google Docs / Notepad
                </a>
              )}
            </div>
          ))}

          {!loading && patents.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <Lock className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-mono">No patents found in Daemoni Drive</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
