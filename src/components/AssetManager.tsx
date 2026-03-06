import { useState, useEffect } from 'react';
import { Upload, HardDrive, Image, Music, Box } from 'lucide-react';
import { uploadAssetMetadata, getAllAssets } from '../services/driveService';
import { AssetMetadata } from '../lib/supabase';

export function AssetManager() {
  const [assets, setAssets] = useState<AssetMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    const { data } = await getAllAssets();
    if (data) {
      setAssets(data);
    }
    setLoading(false);
  };

  const handleFileUpload = async (
    file: File,
    assetType: '3d_model' | 'audio' | 'image',
    district?: string
  ) => {
    setUploading(true);
    try {
      const result = await uploadAssetMetadata(file, assetType, district);
      if (!result.error) {
        await loadAssets();
      }
    } finally {
      setUploading(false);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case '3d_model':
        return <Box className="w-5 h-5" />;
      case 'audio':
        return <Music className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      default:
        return <HardDrive className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-red-500">Daemoni Drive</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <HardDrive className="w-4 h-4" />
            <span>Google Drive Integration Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".glb,.gltf,.obj,.fbx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, '3d_model');
              }}
              className="hidden"
              disabled={uploading}
            />
            <div className="bg-gray-950 border border-gray-800 hover:border-red-600 rounded-lg p-4 text-center transition-colors">
              <Box className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-sm font-medium text-gray-300">Upload 3D Model</div>
              <div className="text-xs text-gray-600">.glb, .gltf, .obj, .fbx</div>
            </div>
          </label>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".mp3,.wav,.ogg,.m4a"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'audio');
              }}
              className="hidden"
              disabled={uploading}
            />
            <div className="bg-gray-950 border border-gray-800 hover:border-red-600 rounded-lg p-4 text-center transition-colors">
              <Music className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-sm font-medium text-gray-300">Upload Audio</div>
              <div className="text-xs text-gray-600">.mp3, .wav, .ogg, .m4a</div>
            </div>
          </label>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.svg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'image');
              }}
              className="hidden"
              disabled={uploading}
            />
            <div className="bg-gray-950 border border-gray-800 hover:border-red-600 rounded-lg p-4 text-center transition-colors">
              <Image className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-sm font-medium text-gray-300">Upload Image</div>
              <div className="text-xs text-gray-600">.jpg, .png, .webp, .svg</div>
            </div>
          </label>
        </div>
      </div>

      {uploading && (
        <div className="bg-red-950 border border-red-800 rounded-lg p-4 mb-4 text-center">
          <Upload className="w-6 h-6 mx-auto mb-2 text-red-400 animate-pulse" />
          <div className="text-red-400">Processing and hashing asset...</div>
        </div>
      )}

      <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <h3 className="font-semibold text-gray-300">Asset Registry</h3>
          <p className="text-xs text-gray-600">SHA-256 hashed with metadata tracking</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading assets...</div>
        ) : assets.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No assets uploaded yet</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {assets.map((asset) => (
              <div key={asset.id} className="p-4 hover:bg-gray-900 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="text-red-500 mt-1">
                    {getAssetIcon(asset.asset_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-300 truncate">
                      {asset.file_name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 font-mono truncate">
                      Hash: {asset.file_hash.substring(0, 16)}...
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Type: {asset.asset_type}</span>
                      {asset.district && <span>District: {asset.district}</span>}
                      <span>
                        Uploaded: {new Date(asset.uploaded_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
