import { useState, useEffect } from 'react';
import { api } from '../utils/api';

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

const HeartIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PenIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const QUICK_ACTIONS = [
  'Completed a full-body workout',
  'Hit a new PR on bench press',
  'Logged a 10K steps day',
  'Finished a 5K morning run'
];

export default function CommunityFeed({ user }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);

  const initial = (user?.email || 'F')[0].toUpperCase();

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
    const text = (action || draft).trim();
    if (!text || posting) return;
    setPosting(true);
    try {
      const newPost = await api.postFeed({
        userId: user.id,
        userName: user.email.split('@')[0],
        action: text
      });
      setFeed([newPost, ...feed]);
      setDraft('');
    } catch (err) {
      console.error(err);
      alert('Error posting to feed');
    } finally {
      setPosting(false);
    }
  };

  const handleSyncWearable = async () => {
    if (!user) return;
    setSyncing(true);
    try {
      const newPost = await api.postFeed({
        userId: user.id,
        userName: user.email.split('@')[0],
        action: 'Synced a 5K Run from Apple Watch'
      });
      setFeed([newPost, ...feed]);
    } catch (err) {
      console.error(err);
      alert('Error syncing wearable');
    } finally {
      setSyncing(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.likePost(postId);
      setFeed(feed.map(p => p._id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-card-dark rounded-3xl p-6 border border-brand-cocoa/30 shadow-xl animate-fadeIn h-[620px] flex flex-col">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-border-pink/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-pink/25 bg-brand-pink/10">
            <UsersIcon />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white leading-none">Community Feed</h2>
            <p className="mt-1 text-xs text-text-muted">Latest workouts from the squad</p>
          </div>
        </div>
        <button
          onClick={handleSyncWearable}
          disabled={syncing}
          className="flex items-center gap-1.5 text-xs bg-bg-dark hover:bg-card-dark border border-brand-cocoa text-brand-cocoa px-3.5 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          <SyncIcon className="h-4 w-4" />
          {syncing ? 'Syncing...' : 'Sync Wearable'}
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-brand-cocoa/25 bg-bg-dark/60 p-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-pink text-sm font-display font-bold text-white">
            {initial}
          </span>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handlePost();
            }}
            placeholder="Share your latest win..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-text-muted/70 focus:outline-none"
          />
          <button
            onClick={() => handlePost()}
            disabled={posting || !draft.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-pink px-3.5 py-2 text-xs font-display font-bold text-white transition hover:bg-brand-pink-hover disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <PenIcon className="h-4 w-4" /> Post
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handlePost(q)}
              disabled={posting}
              className="text-[10px] rounded-lg border border-brand-cocoa/25 bg-brand-cocoa/5 px-2.5 py-1.5 font-semibold text-brand-cocoa-light transition hover:border-brand-cocoa hover:bg-brand-cocoa/15 disabled:opacity-50 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-text-muted text-center py-4">Loading feed...</div>
        ) : feed.length === 0 ? (
          <div className="text-text-muted text-center py-4 text-sm">No activity yet. Post an update or sync a wearable!</div>
        ) : (
          feed.map((post, idx) => (
            <div key={post._id || idx} className="p-4 rounded-2xl bg-bg-dark/60 border border-border-pink/40 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-bold text-brand-pink text-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-pink/15 border border-brand-pink/25 text-[10px]">
                    {(post.userName || 'F')[0].toUpperCase()}
                  </span>
                  {post.userName}
                </span>
                <span className="text-[10px] text-text-muted font-mono shrink-0">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="flex items-start gap-2 text-white text-sm">
                <RunIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-cocoa-light" />
                {post.action}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-1.5 text-xs text-text-muted hover:text-brand-pink transition cursor-pointer"
                >
                  <HeartIcon className="h-4 w-4" />
                  {post.likes || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
