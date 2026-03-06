import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export type AdminUser = {
  id: string;
  email: string;
  terminal_name: string;
  role: 'master' | 'guardian';
  last_login: string;
  created_at: string;
};

export type TerminalSession = {
  id: string;
  admin_id: string;
  terminal_name: string;
  command_log: Array<{ command: string; timestamp: string; output?: string }>;
  started_at: string;
  ended_at?: string;
};

export type AssetMetadata = {
  id: string;
  asset_type: '3d_model' | 'audio' | 'image';
  file_name: string;
  file_hash: string;
  drive_id?: string;
  original_created_at?: string;
  uploaded_at: string;
  uploaded_by?: string;
  district?: string;
  metadata: Record<string, any>;
};

export type PerformanceDistrict = {
  id: string;
  name: string;
  slug: string;
  config: {
    target_fps: number;
    quality: string;
    max_entities?: number;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
};
