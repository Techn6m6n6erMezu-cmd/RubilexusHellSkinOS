import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Grid2x2 as Grid, AlignJustify, Play, Users, ChevronLeft, Settings, Zap } from 'lucide-react';
import SigilMark from './SigilMark';
import {
  getPosts, createPost, likePost, getProfiles, getFeedMode, setFeedMode,
  type SolessPost, type SolessProfile, type FeedMode,
} from '../services/solessService';

const ENTITY_COLORS: Record<string, string> = {
  'npc-iffy': '#ef4444',
  'npc-kado': '#f97316',
  'npc-lyria': '#3b82f6',
  'npc-rubilexus': '#06b6d4',
  'npc-scarecrow': '#6b7280',
  'ai-council': '#eab308',
};

function EntityAvatar({ authorId, authorName, size = 40 }: { authorId: string; authorName: string; size?: number }) {
  const color = ENTITY_COLORS[authorId] ?? '#dc2626';
  const initials = authorName.slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-black shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

function TimeAgo({ dateStr }: { dateStr: string }) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return <span>{diff}s</span>;
  if (diff < 3600) return <span>{Math.floor(diff / 60)}m</span>;
  if (diff < 86400) return <span>{Math.floor(diff / 3600)}h</span>;
  return <span>{Math.floor(diff / 86400)}d</span>;
}

function PulseFeed({ posts, onLike }: { posts: SolessPost[]; onLike: (p: SolessPost) => void }) {
  const filtered = posts.filter(p => p.post_type === 'pulse');
  return (
    <div className="max-w-xl mx-auto space-y-0 divide-y divide-gray-800">
      {filtered.map(post => (
        <div key={post.id} className="py-4 px-4 hover:bg-gray-900/50 transition-colors">
          <div className="flex gap-3">
            <EntityAvatar authorId={post.author_id} authorName={post.author_name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-white text-sm">{post.author_name}</span>
                <span className="text-gray-600 text-xs">
                  @{post.author_id.replace('-', '_')} · <TimeAgo dateStr={post.created_at} />
                </span>
              </div>
              <p className="text-gray-200 text-sm mt-1 leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-6 mt-3">
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-400 transition-colors text-xs group">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
                <button
                  onClick={() => onLike(post)}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-red-400 transition-colors text-xs"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-green-400 transition-colors text-xs">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GridFeed({ posts, onLike }: { posts: SolessPost[]; onLike: (p: SolessPost) => void }) {
  const filtered = posts.filter(p => p.post_type === 'grid' || p.post_type === 'pulse');
  const gradients = [
    'from-red-950 to-black', 'from-orange-950 to-black', 'from-blue-950 to-black',
    'from-cyan-950 to-black', 'from-gray-900 to-black', 'from-yellow-950 to-black',
  ];
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-3 gap-1">
        {filtered.map((post, i) => {
          const color = ENTITY_COLORS[post.author_id] ?? '#dc2626';
          return (
            <div
              key={post.id}
              className={`relative aspect-square bg-gradient-to-br ${gradients[i % gradients.length]} cursor-pointer group overflow-hidden`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black text-sm mb-2"
                  style={{ background: color }}
                >
                  {post.author_name.slice(0, 2)}
                </div>
                <p className="text-white text-xs text-center line-clamp-3 leading-tight">{post.content}</p>
              </div>
              <div
                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4"
              >
                <button
                  onClick={() => onLike(post)}
                  className="flex items-center gap-1.5 text-white text-sm"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  <span>{post.likes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StreamFeed({ posts, onLike }: { posts: SolessPost[]; onLike: (p: SolessPost) => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const filtered = posts.filter(p => p.post_type === 'stream' || p.post_type === 'pulse');
  const post = filtered[activeIdx];
  if (!post) return <div className="text-center text-gray-700 py-20 font-mono">NO STREAM CONTENT</div>;
  const color = ENTITY_COLORS[post.author_id] ?? '#dc2626';

  return (
    <div className="max-w-sm mx-auto">
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ height: 580, background: `linear-gradient(180deg, ${color}20 0%, #000 100%)` }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(circle at 50% 30%, ${color} 0%, transparent 60%)` }}
        />
        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-center justify-center flex-1 p-6">
            <div className="text-center space-y-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl text-black mx-auto shadow-2xl"
                style={{ background: color, boxShadow: `0 0 40px ${color}60` }}
              >
                {post.author_name.slice(0, 2)}
              </div>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
                <span className="text-gray-400 text-xs font-mono tracking-widest">LIVE STREAM</span>
              </div>
              <p className="text-white text-base leading-relaxed max-w-xs">{post.content}</p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{ background: color }}>
                {post.author_name.slice(0, 2)}
              </div>
              <div>
                <div className="text-white text-sm font-bold">{post.author_name}</div>
                <div className="text-gray-500 text-xs">@{post.author_id.replace('-', '_')}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => onLike(post)}
                  className="flex flex-col items-center gap-0.5"
                >
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  <span className="text-white text-xs">{post.likes}</span>
                </button>
                <button className="flex flex-col items-center gap-0.5">
                  <MessageCircle className="w-6 h-6 text-gray-400" />
                  <span className="text-white text-xs">Reply</span>
                </button>
                <button className="flex flex-col items-center gap-0.5">
                  <Share2 className="w-6 h-6 text-gray-400" />
                  <span className="text-white text-xs">Share</span>
                </button>
              </div>
              <button className="flex items-center gap-1 text-gray-400 text-xs border border-gray-700 px-2 py-1 rounded-full">
                <Play className="w-3 h-3" /> Follow
              </button>
            </div>
          </div>
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
          {filtered.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="w-1 rounded-full transition-all"
              style={{
                height: i === activeIdx ? 24 : 8,
                background: i === activeIdx ? color : '#374151',
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        <button
          onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
          disabled={activeIdx === 0}
          className="px-4 py-1.5 text-xs font-mono border border-gray-800 text-gray-500 hover:border-gray-600 disabled:opacity-30 transition-colors"
        >
          PREV
        </button>
        <span className="text-gray-700 text-xs font-mono px-2 py-1.5">{activeIdx + 1}/{filtered.length}</span>
        <button
          onClick={() => setActiveIdx(i => Math.min(filtered.length - 1, i + 1))}
          disabled={activeIdx === filtered.length - 1}
          className="px-4 py-1.5 text-xs font-mono border border-gray-800 text-gray-500 hover:border-gray-600 disabled:opacity-30 transition-colors"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

function ProfileCard({ profile, onSelect }: { profile: SolessProfile; onSelect: () => void }) {
  const color = ENTITY_COLORS[profile.entity_id] ?? '#dc2626';
  return (
    <button
      onClick={onSelect}
      className="text-left border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all group bg-gray-950"
    >
      <div
        className="h-16 w-full"
        style={{ background: `linear-gradient(135deg, ${profile.banner_color ?? '#111827'}, #000)` }}
      />
      <div className="px-4 pb-4 -mt-6">
        <div
          className="w-12 h-12 rounded-full border-2 border-gray-950 flex items-center justify-center font-bold text-black text-sm mb-2"
          style={{ background: color }}
        >
          {profile.display_name.slice(0, 2)}
        </div>
        <div className="text-white font-bold text-sm">{profile.display_name}</div>
        <div className="text-gray-500 text-xs">@{profile.handle}</div>
        <p className="text-gray-400 text-xs mt-2 line-clamp-2">{profile.bio}</p>
        <div className="flex gap-4 mt-3 text-xs">
          <span className="text-white font-bold">{profile.follower_count.toLocaleString()} <span className="text-gray-500 font-normal">followers</span></span>
          <span className="text-white font-bold">{profile.post_count} <span className="text-gray-500 font-normal">posts</span></span>
        </div>
        <div className="mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            profile.entity_type === 'ai' ? 'bg-blue-950 text-blue-400' :
            profile.entity_type === 'npc' ? 'bg-red-950 text-red-400' :
            'bg-gray-800 text-gray-400'
          }`}>
            {profile.entity_type.toUpperCase()}
          </span>
        </div>
      </div>
    </button>
  );
}

function ProfileDetail({ profile, onBack }: { profile: SolessProfile; onBack: () => void }) {
  const color = ENTITY_COLORS[profile.entity_id] ?? '#dc2626';
  return (
    <div className="max-w-xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-4 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <div
        className="h-32 rounded-t-xl w-full"
        style={{ background: `linear-gradient(135deg, ${profile.banner_color ?? '#111827'} 0%, #000 100%)` }}
      />
      <div className="border border-gray-800 border-t-0 rounded-b-xl p-5 -mt-1 bg-gray-950">
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div
            className="w-20 h-20 rounded-full border-4 border-gray-950 flex items-center justify-center font-bold text-2xl text-black"
            style={{ background: color, boxShadow: `0 0 20px ${color}40` }}
          >
            {profile.display_name.slice(0, 2)}
          </div>
          <button className="border border-gray-700 text-gray-300 px-4 py-1.5 rounded-full text-sm hover:border-gray-500 transition-colors">
            Follow
          </button>
        </div>
        <div className="text-white font-bold text-xl">{profile.display_name}</div>
        <div className="text-gray-500 text-sm mb-3">@{profile.handle}</div>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">{profile.bio}</p>
        <div className="flex gap-6 text-sm border-t border-gray-800 pt-4">
          <div><span className="text-white font-bold">{profile.follower_count.toLocaleString()}</span> <span className="text-gray-500">Followers</span></div>
          <div><span className="text-white font-bold">{profile.post_count}</span> <span className="text-gray-500">Posts</span></div>
          <div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              profile.entity_type === 'ai' ? 'bg-blue-950 text-blue-400' : 'bg-red-950 text-red-400'
            }`}>{profile.entity_type.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposeBox({ onPost }: { onPost: (content: string) => void }) {
  const [text, setText] = useState('');
  const submit = () => {
    if (!text.trim()) return;
    onPost(text.trim());
    setText('');
  };
  return (
    <div className="border-b border-gray-800 p-4 max-w-xl mx-auto">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-red-900 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-red-400" />
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's happening in Satan's World..."
            className="w-full bg-transparent text-white placeholder-gray-600 text-sm resize-none outline-none"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-700 text-xs">{text.length}/280</span>
            <button
              onClick={submit}
              disabled={!text.trim()}
              className="px-4 py-1.5 bg-red-700 hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-600 text-white text-sm font-bold rounded-full transition-colors"
            >
              POST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type Tab = 'feed' | 'profiles';

export default function SoLlessStem() {
  const [posts, setPosts] = useState<SolessPost[]>([]);
  const [profiles, setProfiles] = useState<SolessProfile[]>([]);
  const [feedMode, setFeedModeState] = useState<FeedMode>('pulse');
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [selectedProfile, setSelectedProfile] = useState<SolessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [p, pr, mode] = await Promise.all([getPosts(), getProfiles(), getFeedMode()]);
    setPosts(p);
    setProfiles(pr);
    setFeedModeState(mode);
    setLoading(false);
  };

  const handleFeedModeChange = async (mode: FeedMode) => {
    setFeedModeState(mode);
    await setFeedMode(mode);
  };

  const handleLike = async (post: SolessPost) => {
    await likePost(post.id, post.likes);
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handlePost = async (content: string) => {
    const newPost = await createPost({
      author_id: 'user-haezarian',
      author_name: 'HAEZARIAN',
      author_avatar: '',
      content,
      media_url: '',
      post_type: feedMode,
      likes: 0,
    });
    if (newPost) setPosts(prev => [newPost, ...prev]);
  };

  const modeConfig = {
    stream: { label: 'STREAM', icon: <Play className="w-3.5 h-3.5" />, color: 'text-blue-400 border-blue-600 bg-blue-950' },
    grid: { label: 'GRID', icon: <Grid className="w-3.5 h-3.5" />, color: 'text-green-400 border-green-700 bg-green-950' },
    pulse: { label: 'PULSE', icon: <AlignJustify className="w-3.5 h-3.5" />, color: 'text-red-400 border-red-700 bg-red-950' },
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SigilMark size={28} color="#dc2626" />
            <div>
              <h1 className="text-white font-bold text-base tracking-widest leading-none">SO LLESS STEM</h1>
              <p className="text-gray-600 text-xs font-mono">SOVEREIGN SOCIAL NETWORK</p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1.5">
              {(Object.entries(modeConfig) as [FeedMode, typeof modeConfig.pulse][]).map(([mode, cfg]) => (
                <button
                  key={mode}
                  onClick={() => handleFeedModeChange(mode)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 border text-xs font-bold rounded transition-all ${
                    feedMode === mode ? cfg.color : 'border-gray-800 text-gray-600 hover:border-gray-600'
                  }`}
                >
                  {cfg.icon}
                  <span className="hidden sm:inline">{cfg.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex border-b border-gray-800 max-w-xl mx-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              activeTab === 'feed' ? 'text-white border-b-2 border-red-500' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'profiles' ? 'text-white border-b-2 border-red-500' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Profiles
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <SigilMark size={40} color="#dc2626" className="mx-auto animate-pulse" />
            <p className="text-gray-700 text-xs font-mono mt-3">LOADING FEED...</p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'feed' && (
            <>
              {feedMode === 'pulse' && <ComposeBox onPost={handlePost} />}
              <div className="py-4">
                {feedMode === 'pulse' && <PulseFeed posts={posts} onLike={handleLike} />}
                {feedMode === 'grid' && <GridFeed posts={posts} onLike={handleLike} />}
                {feedMode === 'stream' && <StreamFeed posts={posts} onLike={handleLike} />}
              </div>
            </>
          )}

          {activeTab === 'profiles' && (
            <div className="p-4">
              {selectedProfile ? (
                <ProfileDetail profile={selectedProfile} onBack={() => setSelectedProfile(null)} />
              ) : (
                <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profiles.map(p => (
                    <ProfileCard key={p.id} profile={p} onSelect={() => setSelectedProfile(p)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="border-t border-gray-900 p-4 text-center mt-8">
        <div className="flex items-center justify-center gap-2 text-gray-700">
          <SigilMark size={14} color="#374151" />
          <span className="text-xs font-mono">SO LLESS STEM • HELLSKIN OS SOCIAL LAYER • PROPERTY OF RYAN JAMES CORTRIGHT & JOHN AARON SLONE</span>
        </div>
      </div>
    </div>
  );
}
