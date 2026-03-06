import { supabase } from '../lib/supabase';

export async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function extractFileMetadata(file: File) {
  const hash = await hashFile(file);

  let originalCreatedAt: string | undefined;

  if (file.lastModified) {
    originalCreatedAt = new Date(file.lastModified).toISOString();
  }

  return {
    fileName: file.name,
    fileHash: hash,
    fileSize: file.size,
    fileType: file.type,
    originalCreatedAt,
  };
}

export async function uploadAssetMetadata(
  file: File,
  assetType: '3d_model' | 'audio' | 'image',
  district?: string,
  driveId?: string
) {
  const metadata = await extractFileMetadata(file);
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supabase
    .from('asset_metadata')
    .insert({
      asset_type: assetType,
      file_name: metadata.fileName,
      file_hash: metadata.fileHash,
      drive_id: driveId,
      original_created_at: metadata.originalCreatedAt,
      uploaded_by: userId,
      district,
      metadata: {
        file_size: metadata.fileSize,
        file_type: metadata.fileType,
      },
    })
    .select()
    .single();

  return { data, error };
}

export async function getAssetsByDistrict(district: string) {
  const { data, error } = await supabase
    .from('asset_metadata')
    .select('*')
    .eq('district', district)
    .order('uploaded_at', { ascending: false });

  return { data, error };
}

export async function getAllAssets() {
  const { data, error } = await supabase
    .from('asset_metadata')
    .select('*')
    .order('uploaded_at', { ascending: false });

  return { data, error };
}

export const DRIVE_CONFIG = {
  enabled: true,
  autoSync: true,
  autoHash: true,
  supportedTypes: {
    '3d_model': ['.glb', '.gltf', '.obj', '.fbx'],
    'audio': ['.mp3', '.wav', '.ogg', '.m4a'],
    'image': ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
  },
};
