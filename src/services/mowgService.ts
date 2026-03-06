import { supabase } from '../lib/supabase';

export type MowgAsset = {
  id: string;
  title: string;
  asset_type: 'game' | 'movie' | 'music';
  genre: string;
  release_year: number;
  description: string;
  cover_color: string;
  remake_count: number;
  is_featured: boolean;
  created_at: string;
};

export type SoullessUnit = {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'bowing' | 'possessed' | 'smitten';
  current_task: string;
  xp_level: number;
  learned_actions: string[];
  spawned_at: string;
};

export async function getMowgAssets(type?: 'game' | 'movie' | 'music'): Promise<MowgAsset[]> {
  let q = supabase.from('mowg_assets').select('*').order('release_year', { ascending: false });
  if (type) q = q.eq('asset_type', type);
  const { data } = await q;
  return data ?? [];
}

export async function getFeaturedAssets(): Promise<MowgAsset[]> {
  const { data } = await supabase.from('mowg_assets').select('*').eq('is_featured', true);
  return data ?? [];
}

export async function incrementRemakeCount(id: string, current: number): Promise<void> {
  await supabase.from('mowg_assets').update({ remake_count: current + 1 }).eq('id', id);
}

export async function getSoullessUnits(): Promise<SoullessUnit[]> {
  const { data } = await supabase
    .from('the_soulless')
    .select('*')
    .order('spawned_at', { ascending: true });
  return (data ?? []) as SoullessUnit[];
}

export async function spawnSoulless(name: string): Promise<SoullessUnit | null> {
  const { data } = await supabase
    .from('the_soulless')
    .insert({ name, status: 'idle', current_task: 'Awaiting orders from the Haezarian.', xp_level: 0 })
    .select()
    .maybeSingle();
  return data as SoullessUnit | null;
}

export async function commandSoulless(
  id: string,
  status: SoullessUnit['status'],
  task: string
): Promise<void> {
  await supabase.from('the_soulless').update({ status, current_task: task }).eq('id', id);
}

export async function smiteSoulless(id: string): Promise<void> {
  await supabase.from('the_soulless').delete().eq('id', id);
}

export async function massCommand(status: SoullessUnit['status'], task: string): Promise<void> {
  await supabase.from('the_soulless').update({ status, current_task: task });
}

export async function levelUpSoulless(id: string, currentXP: number, action: string): Promise<void> {
  const { data } = await supabase.from('the_soulless').select('learned_actions').eq('id', id).maybeSingle();
  const existing = (data?.learned_actions as string[]) ?? [];
  const updated = [...existing.slice(-9), action];
  await supabase.from('the_soulless').update({
    xp_level: currentXP + 1,
    learned_actions: updated,
  }).eq('id', id);
}
