import { supabase } from '../lib/supabase';

export interface CouncilMember {
  id: string;
  member_key: string;
  display_name: string;
  role: string;
  primary_color: string;
  secondary_color: string;
  avatar_style: string;
  memory_vault: Record<string, any>;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouncilMemory {
  id: string;
  member_id: string;
  memory_type: string;
  content: string;
  source: string;
  created_at: string;
}

export const getAllCouncilMembers = async (): Promise<CouncilMember[]> => {
  const { data, error } = await supabase
    .from('council_members')
    .select('*')
    .eq('is_active', true)
    .order('created_at');

  if (error) {
    console.error('[COUNCIL] Failed to fetch members:', error);
    return [];
  }
  return data || [];
};

export const updateCouncilMemberName = async (id: string, displayName: string): Promise<boolean> => {
  const { error } = await supabase
    .from('council_members')
    .update({ display_name: displayName, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('[COUNCIL] Failed to rename member:', error);
    return false;
  }
  return true;
};

export const updateCouncilMemberColors = async (
  id: string,
  primaryColor: string,
  secondaryColor: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('council_members')
    .update({ primary_color: primaryColor, secondary_color: secondaryColor, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('[COUNCIL] Failed to update colors:', error);
    return false;
  }
  return true;
};

export const updateMemberVault = async (id: string, vault: Record<string, any>): Promise<boolean> => {
  const { error } = await supabase
    .from('council_members')
    .update({ memory_vault: vault, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('[COUNCIL] Failed to update vault:', error);
    return false;
  }
  return true;
};

export const updateMemberStatus = async (id: string, status: string): Promise<boolean> => {
  const { error } = await supabase
    .from('council_members')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return false;
  return true;
};

export const getMemberMemories = async (memberId: string, limit = 10): Promise<CouncilMemory[]> => {
  const { data, error } = await supabase
    .from('council_memories')
    .select('*')
    .eq('member_id', memberId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[COUNCIL] Failed to fetch memories:', error);
    return [];
  }
  return data || [];
};

export const addMemberMemory = async (
  memberId: string,
  memoryType: string,
  content: string,
  source = 'user'
): Promise<CouncilMemory | null> => {
  const { data, error } = await supabase
    .from('council_memories')
    .insert({ member_id: memberId, memory_type: memoryType, content, source })
    .select()
    .single();

  if (error) {
    console.error('[COUNCIL] Failed to add memory:', error);
    return null;
  }
  return data;
};

export const logGlitchAttempt = async (email: string): Promise<void> => {
  await supabase
    .from('glitch_log')
    .insert({ attempted_email: email, glitch_triggered: true });
};

export const triggerGlitchTrap = async (email: string): Promise<void> => {
  await supabase
    .from('glitch_log')
    .insert({ attempted_email: email, glitch_triggered: true });
};

export const logHaezarianLogin = async (email: string): Promise<void> => {
  await supabase
    .from('glitch_log')
    .insert({ attempted_email: email, glitch_triggered: false });
};

export interface SentientAgent {
  slug: string;
  display_name: string;
  color_primary: string;
  color_secondary: string;
  role: string;
  status: string;
  memory_vault: Record<string, any>;
}

export const getAllAgents = async (): Promise<SentientAgent[]> => {
  const { data, error } = await supabase
    .from('council_members')
    .select('*')
    .eq('is_active', true)
    .order('created_at');

  if (error) {
    console.error('[COUNCIL] Failed to fetch agents:', error);
    return [];
  }

  return (data || []).map(m => ({
    slug: m.member_key,
    display_name: m.display_name,
    color_primary: m.primary_color,
    color_secondary: m.secondary_color,
    role: m.role,
    status: m.status,
    memory_vault: m.memory_vault || {},
  }));
};
