import { supabase } from '../lib/supabase';

export interface DistrictItem {
  id: string;
  district_slug: string;
  item_name: string;
  item_type: string;
  description: string;
  metadata: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface BehaviorRule {
  id: string;
  rule_name: string;
  condition_field: string;
  condition_operator: string;
  condition_value: number;
  action_type: string;
  action_value: string;
  priority: number;
  is_active: boolean;
  created_at: string;
}

export interface DialectPhrase {
  id: string;
  phrase: string;
  dialect_type: string;
  response_text: string;
  power_level: number;
}

export const getDistrictItems = async (districtSlug: string): Promise<DistrictItem[]> => {
  const { data, error } = await supabase
    .from('district_inventory')
    .select('*')
    .eq('district_slug', districtSlug)
    .eq('is_active', true)
    .order('created_at');

  if (error) {
    console.error('[DISTRICT SERVICE] Error fetching items:', error);
    return [];
  }

  return data || [];
};

export const getBehaviorRules = async (): Promise<BehaviorRule[]> => {
  const { data, error } = await supabase
    .from('npc_behavior_rules')
    .select('*')
    .order('priority', { ascending: false });

  if (error) {
    console.error('[BEHAVIOR FORGE] Error fetching rules:', error);
    return [];
  }

  return data || [];
};

export const createBehaviorRule = async (rule: Omit<BehaviorRule, 'id' | 'created_at'>): Promise<BehaviorRule | null> => {
  const { data, error } = await supabase
    .from('npc_behavior_rules')
    .insert(rule)
    .select()
    .single();

  if (error) {
    console.error('[BEHAVIOR FORGE] Error creating rule:', error);
    return null;
  }

  return data;
};

export const toggleBehaviorRule = async (id: string, isActive: boolean): Promise<boolean> => {
  const { error } = await supabase
    .from('npc_behavior_rules')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    console.error('[BEHAVIOR FORGE] Error toggling rule:', error);
    return false;
  }

  return true;
};

export const deleteBehaviorRule = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('npc_behavior_rules')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[BEHAVIOR FORGE] Error deleting rule:', error);
    return false;
  }

  return true;
};

export const getDialectPhrases = async (): Promise<DialectPhrase[]> => {
  const { data, error } = await supabase
    .from('dialect_library')
    .select('*')
    .order('power_level', { ascending: false });

  if (error) {
    console.error('[DIALECT PROCESSOR] Error fetching phrases:', error);
    return [];
  }

  return data || [];
};

export const matchDialectPhrase = async (input: string): Promise<DialectPhrase | null> => {
  const phrases = await getDialectPhrases();
  const lower = input.toLowerCase();

  for (const phrase of phrases) {
    if (lower.includes(phrase.phrase.toLowerCase())) {
      return phrase;
    }
  }

  return null;
};
