import { supabase } from '../lib/supabase';

// ============================================
// Type Definitions
// ============================================

export interface NPC {
  id: string;
  name: string;
  personality: 'social' | 'gamer' | 'cinephile' | 'music_lover' | 'explorer' | 'critic';
  current_location: string;
  current_activity: string;
  mood: number;
  energy: number;
  preferences: any;
  stats: any;
  last_action_at: string;
}

export interface Building {
  id: string;
  name: string;
  type: 'pumpkin_cinema' | 'arcade' | 'concert_stage' | 'magik_core' | 'spawn_area';
  capacity: number;
  config: any;
  is_active: boolean;
}

export interface Content {
  id: string;
  title: string;
  type: 'movie' | 'game' | 'concert' | 'media';
  building_id: string;
  metadata: any;
  average_rating: number;
  total_ratings: number;
}

export interface Rating {
  id: string;
  npc_id: string;
  content_id: string;
  rating: number;
  comment: string;
  rated_at: string;
}

export interface Activity {
  id: string;
  npc_id: string;
  building_id?: string;
  activity_type: 'watching' | 'playing' | 'listening' | 'idle' | 'walking' | 'rating';
  content_id?: string;
  started_at: string;
  ended_at?: string;
  outcome: any;
}

export interface MagikMemory {
  id: string;
  memory_type: 'npc_state' | 'world_event' | 'rating' | 'activity' | 'snapshot';
  data: any;
  timestamp: string;
  patent_tag: string;
}

// ============================================
// NPC Functions
// ============================================

export const getAllNPCs = async (): Promise<NPC[]> => {
  const { data, error } = await supabase
    .from('sim_npcs')
    .select('*')
    .order('name');

  if (error) {
    console.error('%c[SIM-WORLD ERROR]: Failed to fetch NPCs', 'color: red;', error);
    return [];
  }

  return data || [];
};

export const updateNPC = async (id: string, updates: Partial<NPC>): Promise<boolean> => {
  const { error } = await supabase
    .from('sim_npcs')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('%c[SIM-WORLD ERROR]: Failed to update NPC', 'color: red;', error);
    return false;
  }

  return true;
};

// ============================================
// Building Functions
// ============================================

export const getAllBuildings = async (): Promise<Building[]> => {
  const { data, error } = await supabase
    .from('sim_buildings')
    .select('*')
    .order('name');

  if (error) {
    console.error('%c[SIM-WORLD ERROR]: Failed to fetch buildings', 'color: red;', error);
    return [];
  }

  return data || [];
};

export const getBuildingByType = async (type: string): Promise<Building | null> => {
  const { data, error } = await supabase
    .from('sim_buildings')
    .select('*')
    .eq('type', type)
    .maybeSingle();

  if (error) {
    console.error('%c[SIM-WORLD ERROR]: Failed to fetch building', 'color: red;', error);
    return null;
  }

  return data;
};

// ============================================
// Content Functions
// ============================================

export const getAllContent = async (): Promise<Content[]> => {
  const { data, error } = await supabase
    .from('sim_content')
    .select('*')
    .order('title');

  if (error) {
    console.error('%c[SIM-WORLD ERROR]: Failed to fetch content', 'color: red;', error);
    return [];
  }

  return data || [];
};

export const getContentByBuilding = async (buildingId: string): Promise<Content[]> => {
  const { data, error } = await supabase
    .from('sim_content')
    .select('*')
    .eq('building_id', buildingId);

  if (error) {
    console.error('%c[SIM-WORLD ERROR]: Failed to fetch content', 'color: red;', error);
    return [];
  }

  return data || [];
};

// ============================================
// Rating Functions
// ============================================

export const createRating = async (
  npcId: string,
  contentId: string,
  rating: number,
  comment: string
): Promise<Rating | null> => {
  const { data, error } = await supabase
    .from('sim_ratings')
    .insert({
      npc_id: npcId,
      content_id: contentId,
      rating,
      comment,
    })
    .select()
    .single();

  if (error) {
    console.error('%c[SIM-WORLD ERROR]: Failed to create rating', 'color: red;', error);
    return null;
  }

  // Update content average rating
  await updateContentRating(contentId);

  return data;
};

export const getAllRatings = async (): Promise<Rating[]> => {
  const { data, error } = await supabase
    .from('sim_ratings')
    .select('*')
    .order('rated_at', { ascending: false });

  if (error) {
    console.error('%c[SIM-WORLD ERROR]: Failed to fetch ratings', 'color: red;', error);
    return [];
  }

  return data || [];
};

const updateContentRating = async (contentId: string): Promise<void> => {
  const { data: ratings } = await supabase
    .from('sim_ratings')
    .select('rating')
    .eq('content_id', contentId);

  if (ratings && ratings.length > 0) {
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    await supabase
      .from('sim_content')
      .update({
        average_rating: avg.toFixed(2),
        total_ratings: ratings.length,
      })
      .eq('id', contentId);
  }
};

// ============================================
// Activity Functions
// ============================================

export const createActivity = async (activity: Partial<Activity>): Promise<Activity | null> => {
  const { data, error } = await supabase
    .from('sim_activities')
    .insert(activity)
    .select()
    .single();

  if (error) {
    console.error('%c[SIM-WORLD ERROR]: Failed to create activity', 'color: red;', error);
    return null;
  }

  return data;
};

export const endActivity = async (activityId: string, outcome: any): Promise<boolean> => {
  const { error } = await supabase
    .from('sim_activities')
    .update({
      ended_at: new Date().toISOString(),
      outcome,
    })
    .eq('id', activityId);

  if (error) {
    console.error('%c[SIM-WORLD ERROR]: Failed to end activity', 'color: red;', error);
    return false;
  }

  return true;
};

export const getRecentActivities = async (limit: number = 50): Promise<Activity[]> => {
  const { data, error } = await supabase
    .from('sim_activities')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('%c[SIM-WORLD ERROR]: Failed to fetch activities', 'color: red;', error);
    return [];
  }

  return data || [];
};

// ============================================
// Magik Core (S6ul Sphere 66) Functions
// ============================================

export const saveMagikMemory = async (
  memoryType: MagikMemory['memory_type'],
  data: any
): Promise<MagikMemory | null> => {
  const { data: memory, error } = await supabase
    .from('sim_magik_core')
    .insert({
      memory_type: memoryType,
      data,
    })
    .select()
    .single();

  if (error) {
    console.error('%c[MAGIK CORE ERROR]: Failed to save memory', 'color: red;', error);
    return null;
  }

  console.log(`%c[S6UL SPHERE 66]: Memory saved - ${memoryType}`, 'color: gold; font-weight: bold;');
  return memory;
};

export const getMagikMemories = async (
  memoryType?: string,
  limit: number = 100
): Promise<MagikMemory[]> => {
  let query = supabase
    .from('sim_magik_core')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (memoryType) {
    query = query.eq('memory_type', memoryType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('%c[MAGIK CORE ERROR]: Failed to fetch memories', 'color: red;', error);
    return [];
  }

  return data || [];
};

export const createWorldSnapshot = async (): Promise<MagikMemory | null> => {
  const npcs = await getAllNPCs();
  const buildings = await getAllBuildings();
  const activities = await getRecentActivities(20);

  return saveMagikMemory('snapshot', {
    npcs,
    buildings,
    activities,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// God Mode Functions
// ============================================

export const checkGodMode = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('admin_god_mode')
    .select('is_active')
    .eq('email', email)
    .maybeSingle();

  if (error || !data) return false;

  return data.is_active;
};

export const getGodModePermissions = async (email: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('admin_god_mode')
    .select('permissions')
    .eq('email', email)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return [];

  return data.permissions || [];
};
