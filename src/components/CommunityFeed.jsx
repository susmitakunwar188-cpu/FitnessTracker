import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { toast } from '../utils/toast';

const UsersIcon = ({ className = "h-6 w-6 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SyncIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6" />
    <path d="M2.5 22v-6h6" />
    <path d="M20.34 15.57A10 10 0 1 1 7.17 4.1" />
  </svg>
);

const RunIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13" cy="4" r="2" />
    <path d="M8 21l3-6 3 4 3-7" />
    <path d="M5 8l5-2 2 3" />
  </svg>
);

const HeartIcon = ({ className = "h-4 w-4", filled = false }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ChatIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const DumbbellIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11M6.5 17.5h11M12 6.5v11M3 10v4M21 10v4M6.5 5v14M17.5 5v14" />
  </svg>
);

const AppleIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 3C7 3 4 7.5 4 12c0 5 3.5 9 8.5 9 3 0 5.5-2 5.5-5 0-1.8-1-3-2.5-4 0-3 0-6-2.5-9Z" />
    <path d="M15 3h5v5" />
  </svg>
);

const TrophyIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21 1.18.54 2.03 2.03 2.03 3.79" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const PenIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SendIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const TrashIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const TYPE_META = {
  workout: { label: 'Workout', icon: <DumbbellIcon className="h-3.5 w-3.5" />, pill: 'text-brand-pink border-brand-pink/30 bg-brand-pink/10' },
  run: { label: 'Run', icon: <RunIcon className="h-3.5 w-3.5" />, pill: 'text-accent-cocoa-light border-brand-cocoa/30 bg-brand-cocoa/10' },
  nutrition: { label: 'Nutrition', icon: <AppleIcon className="h-3.5 w-3.5" />, pill: 'text-green-400 border-green-400/30 bg-green-400/10' },
  goal: { label: 'Goal', icon: <TrophyIcon className="h-3.5 w-3.5" />, pill: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
  social: { label: 'Update', icon: <PenIcon className="h-3.5 w-3.5" />, pill: 'text-text-muted border-border-pink/40 bg-bg-dark/60' }
};

const FILTERS = ['all', 'workout', 'run', 'nutrition', 'goal'];

const QUICK_ACTIONS = [
  { label: 'Completed a full-body workout', type: 'workout' },
  { label: 'Hit a new PR on bench press', type: 'workout' },
  { label: 'Finished a 5K morning run', type: 'run' },
  { label: 'Hit my protein goal today', type: 'nutrition' },
  { label: 'Slept 8h — recovery score 92', type: 'goal' }
];

const WEARABLE_SYNCS = [
  { action: 'Synced a 5K Run from Apple Watch', type: 'run' },
  { action: 'Garmin recorded 8,420 steps today', type: 'run' },
  { action: 'Whoop recovery score: 87 — ready to train', type: 'goal' },
  { action: 'Sleep synced: 7h 42m last night', type: 'goal' }
];

const timeAgo = (iso) => {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  const now = Date.now();
  const mins = Math.max(0, Math.floor((now - then) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const AuthorAvatar = ({ url, name, size = "h-9 w-9", textClass = "text-xs" }) =>
  url ? (
    <img src={url} alt="" className={`${size} shrink-0 rounded-full border border-brand-pink/30 object-cover object-center`} />
  ) : (
    <span className={`${size} shrink-0 flex items-center justify-center rounded-full border border-brand-pink/25 bg-brand-pink/15 font-display font-bold text-brand-pink ${textClass}`}>
      {(name || 'F')[0].toUpperCase()}
    </span>
  );

export default function CommunityFeed({ user }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [commentDrafts, setCommentDrafts] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [commentingId, setCommentingId] = useState(null);
  const [likingId, setLikingId] = useState(null);

  const displayName = user?.username || (user?.email ? user.email.split('@')[0] : 'Athlete');
  const userId = user?.id;

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const data = await api.getFeed();
      if (data) setFeed(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchFeed();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handlePost = async (action) => {
    if (!user) return;
    const quick = QUICK_ACTIONS.find((q) => q.label === action);
    const text = (action || draft).trim();
    if (!text || posting) return;
    setPosting(true);
    try {
      const newPost = await api.postFeed({
        userId,
        userName: displayName,
        avatarUrl: user?.avatarUrl || '',
        action: text,
        type: quick?.type || 'social'
      });
      setFeed([newPost, ...feed]);
      setDraft('');
    } catch (err) {
      console.error(err);
      toast.error('Error posting to feed');
    } finally {
      setPosting(false);
    }
  };

  const handleSyncWearable = async () => {
    if (!user) return;
    setSyncing(true);
    try {
      const sync = WEARABLE_SYNCS[Math.floor(Math.random() * WEARABLE_SYNCS.length)];
      const newPost = await api.postFeed({
        userId,
        userName: displayName,
        avatarUrl: user?.avatarUrl || '',
        action: sync.action,
        type: sync.type
      });
      setFeed([newPost, ...feed]);
      toast.success('Wearable data synced to the feed');
    } catch (err) {
      console.error(err);
      toast.error('Error syncing wearable');
    } finally {
      setSyncing(false);
    }
  };

  const handleLike = async (post) => {
    if (!user || likingId) return;
    const id = post._id || post.id;
    const alreadyLiked = (post.likedBy || []).includes(userId);
    setLikingId(id);
    try {
      const res = await api.likePost(id, userId);
      setFeed(feed.map((p) => {
        const pid = p._id || p.id;
        if (pid !== id) return p;
        const likedBy = alreadyLiked
          ? (p.likedBy || []).filter((u) => u !== userId)
          : [...(p.likedBy || []), userId];
        return { ...p, likes: res.likes, likedBy };
      }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update like');
    } finally {
      setLikingId(null);
    }
  };

  const toggleComments = (id) => setOpenComments((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleComment = async (post) => {
    if (!user || commentingId) return;
    const id = post._id || post.id;
    const text = (commentDrafts[id] || '').trim();
    if (!text) return;
    setCommentingId(id);
    try {
      const comment = await api.commentPost(id, {
        userName: displayName,
        avatarUrl: user?.avatarUrl || '',
        text
      });
      setFeed(feed.map((p) => (p._id || p.id) === id ? { ...p, comments: [...(p.comments || []), comment] } : p));
      setCommentDrafts({ ...commentDrafts, [id]: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to post comment');
    } finally {
      setCommentingId(null);
    }
  };

  const handleDelete = async (post) => {
    if (!user) return;
    const id = post._id || post.id;
    try {
      await api.deletePost(id, userId);
      setFeed(feed.filter((p) => (p._id || p.id) !== id));
      toast.success('Post deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete post');
    }
  };

  const filteredFeed = filter === 'all' ? feed : feed.filter((p) => p.type === filter);

  return (
    <div className="bg-card-dark rounded-3xl p-6 border border-brand-cocoa/30 shadow-sm animate-fadeIn flex flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border-pink/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-pink/25 bg-brand-pink/10">
            <UsersIcon />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-text-primary leading-none">Community Feed</h2>
            <p className="mt-1 text-xs text-text-muted">Latest workouts, runs and wins from the squad</p>
          </div>
        </div>
        <button
          onClick={handleSyncWearable}
          disabled={syncing}
          className="flex items-center gap-1.5 text-xs bg-bg-dark hover:bg-card-dark border border-brand-cocoa text-accent-cocoa px-3.5 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          <SyncIcon className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Wearable'}
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-brand-cocoa/25 bg-bg-dark/60 p-3.5">
        <div className="flex items-center gap-2">
          <AuthorAvatar url={user?.avatarUrl} name={displayName} />
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handlePost();
            }}
            placeholder="Share your latest win..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted/70 focus:outline-none"
          />
          <button
            onClick={() => handlePost()}
            disabled={posting || !draft.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-pink px-3.5 py-2 text-xs font-display font-bold text-text-primary transition hover:bg-brand-pink-hover disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <PenIcon className="h-4 w-4" /> Post
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((q) => (
            <button
              key={q.label}
              onClick={() => handlePost(q.label)}
              disabled={posting}
              className="text-[11px] rounded-lg border border-brand-cocoa/25 bg-brand-cocoa/5 px-2.5 py-1.5 font-semibold text-accent-cocoa-light transition hover:border-brand-cocoa hover:bg-brand-cocoa/15 disabled:opacity-50 cursor-pointer"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition cursor-pointer ${
                active
                  ? 'bg-brand-pink text-white shadow-sm'
                  : 'border border-border-pink bg-bg-dark text-text-muted hover:border-brand-pink hover:text-text-primary'
              }`}
            >
              {f === 'all' ? 'All' : TYPE_META[f].label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-text-muted text-center py-4">Loading feed...</div>
        ) : filteredFeed.length === 0 ? (
          <div className="text-text-muted text-center py-4 text-sm">
            {feed.length === 0
              ? 'No activity yet. Post an update or sync a wearable!'
              : `No ${filter === 'all' ? '' : TYPE_META[filter].label.toLowerCase()} posts yet. Be the first to share one!`}
          </div>
        ) : (
          filteredFeed.map((post, idx) => {
            const id = post._id || post.id || idx;
            const meta = TYPE_META[post.type] || TYPE_META.social;
            const liked = (post.likedBy || []).includes(userId);
            const isOwner = post.userId === userId;
            const commentsOpen = !!openComments[id];
            const commentCount = (post.comments || []).length;

            return (
              <div key={id} className="p-4 rounded-2xl bg-bg-dark/60 border border-border-pink/40 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AuthorAvatar url={post.avatarUrl} name={post.userName} size="h-10 w-10" textClass="text-sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-display font-bold text-text-primary text-sm truncate">{post.userName}</p>
                        <span className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.pill}`}>
                          {meta.icon}
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted font-mono mt-0.5">{timeAgo(post.createdAt)}</p>
                    </div>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(post)}
                      className="shrink-0 rounded-lg p-1.5 text-red-400/70 transition hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                      aria-label="Delete post"
                      title="Delete post"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <p className="flex items-start gap-2 text-text-primary text-sm leading-relaxed">
                  {meta.icon}
                  <span>{post.action}</span>
                </p>

                <div className="flex items-center gap-4 border-t border-border-pink/20 pt-2.5">
                  <button
                    onClick={() => handleLike(post)}
                    disabled={likingId === id}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer disabled:opacity-50 ${liked ? 'text-brand-pink' : 'text-text-muted hover:text-brand-pink'}`}
                  >
                    <HeartIcon className="h-4 w-4" filled={liked} />
                    {post.likes || 0}
                  </button>
                  <button
                    onClick={() => toggleComments(id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer ${commentsOpen ? 'text-brand-pink' : 'text-text-muted hover:text-brand-pink'}`}
                  >
                    <ChatIcon className="h-4 w-4" />
                    {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                  </button>
                </div>

                {commentsOpen && (
                  <div className="space-y-2.5 border-t border-border-pink/20 pt-2.5">
                    {(post.comments || []).map((c, i) => (
                      <div key={`${id}-c-${i}`} className="flex items-start gap-2">
                        <AuthorAvatar url={c.avatarUrl} name={c.userName} size="h-7 w-7" textClass="text-[10px]" />
                        <div className="min-w-0 flex-1 rounded-xl rounded-tl-sm border border-border-pink/25 bg-bg-dark/80 px-3 py-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-text-primary truncate">{c.userName}</p>
                            <p className="shrink-0 text-[10px] text-text-muted font-mono">{timeAgo(c.createdAt)}</p>
                          </div>
                          <p className="mt-0.5 text-xs text-text-muted leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <AuthorAvatar url={user?.avatarUrl} name={displayName} size="h-7 w-7" textClass="text-[10px]" />
                      <input
                        value={commentDrafts[id] || ''}
                        onChange={e => setCommentDrafts({ ...commentDrafts, [id]: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleComment(post);
                        }}
                        placeholder="Write a comment..."
                        className="flex-1 rounded-xl border border-border-pink/40 bg-bg-dark px-3 py-2 text-xs text-text-primary placeholder:text-text-muted/70 focus:border-brand-pink focus:outline-none"
                      />
                      <button
                        onClick={() => handleComment(post)}
                        disabled={commentingId === id || !(commentDrafts[id] || '').trim()}
                        className="flex shrink-0 items-center gap-1 rounded-lg bg-brand-pink/15 px-2.5 py-2 text-brand-pink transition hover:bg-brand-pink hover:text-white disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        aria-label="Send comment"
                      >
                        <SendIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
