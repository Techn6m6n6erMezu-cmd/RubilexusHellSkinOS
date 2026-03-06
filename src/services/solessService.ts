import { supabase } from '../lib/supabase';

export type SolessPost = {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  media_url: string;
  post_type: 'stream' | 'grid' | 'pulse';
  likes: number;
  created_at: string;
};

export type SolessProfile = {
  id: string;
  entity_id: string;
  entity_type: 'user' | 'npc' | 'ai';
  display_name: string;
  handle: string;
  bio: string;
  avatar_url: string;
  banner_color: string;
  is_public: boolean;
  follower_count: number;
  post_count: number;
  created_at: string;
};

export type FeedMode = 'stream' | 'grid' | 'pulse';

export async function getFeedMode(): Promise<FeedMode> {
  const { data } = await supabase
    .from('soless_feed_config')
    .select('feed_mode')
    .maybeSingle();
  return (data?.feed_mode as FeedMode) ?? 'pulse';
}

export async function setFeedMode(mode: FeedMode): Promise<void> {
  const { data } = await supabase.from('soless_feed_config').select('id').maybeSingle();
  if (data?.id) {
    await supabase
      .from('soless_feed_config')
      .update({ feed_mode: mode, updated_at: new Date().toISOString() })
      .eq('id', data.id);
  }
}

export async function getPosts(postType?: FeedMode): Promise<SolessPost[]> {
  let query = supabase
    .from('soless_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (postType) {
    query = query.eq('post_type', postType);
  }

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function createPost(post: Omit<SolessPost, 'id' | 'created_at'>): Promise<SolessPost | null> {
  const { data, error } = await supabase
    .from('soless_posts')
    .insert(post)
    .select()
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function likePost(postId: string, currentLikes: number): Promise<void> {
  await supabase
    .from('soless_posts')
    .update({ likes: currentLikes + 1 })
    .eq('id', postId);
}

export async function getProfiles(): Promise<SolessProfile[]> {
  const { data, error } = await supabase
    .from('soless_profiles')
    .select('*')
    .eq('is_public', true)
    .order('follower_count', { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getProfileByHandle(handle: string): Promise<SolessProfile | null> {
  const { data } = await supabase
    .from('soless_profiles')
    .select('*')
    .eq('handle', handle)
    .maybeSingle();
  return data;
}

export async function getBubbleConfig(): Promise<{ bubble_size: string; bubble_opacity: number }> {
  const { data } = await supabase
    .from('pop_bubble_config')
    .select('bubble_size, bubble_opacity')
    .maybeSingle();
  return data ?? { bubble_size: 'medium', bubble_opacity: 0.9 };
}

export async function setBubbleConfig(size: string, opacity: number): Promise<void> {
  const { data } = await supabase.from('pop_bubble_config').select('id').maybeSingle();
  if (data?.id) {
    await supabase
      .from('pop_bubble_config')
      .update({ bubble_size: size, bubble_opacity: opacity, updated_at: new Date().toISOString() })
      .eq('id', data.id);
  }
}
