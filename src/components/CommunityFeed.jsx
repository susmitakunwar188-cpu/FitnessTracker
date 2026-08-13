import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { toast } from '../utils/toast';

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

export default function CommunityFeed({ user }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
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

  const handlePost = async () => {
    const text = draft.trim();
    if (!user || posting) return;
    if (!text) return;
    setPosting(true);
    try {
      const newPost = await api.postFeed({
        userId,
        userName: displayName,
        avatarUrl: user?.avatarUrl || '',
        action: text,
        type: 'social'
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

  return (
    <div className="bg-card-dark rounded-3xl p-6 border border-brand-cocoa/30 shadow-sm animate-fadeIn flex flex-col">
      {user ? (
        <div className="mb-4 rounded-2xl border border-brand-cocoa/25 bg-bg-dark/60 p-3.5">
          <div className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePost();
              }}
              placeholder="Share your latest win..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted/70 focus:outline-none"
            />
            <button
              onClick={handlePost}
              disabled={posting || !draft.trim()}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-pink px-3.5 py-2 text-xs font-display font-bold text-text-primary transition hover:bg-brand-pink-hover disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <PenIcon className="h-4 w-4" /> Post
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-4 rounded-2xl border border-brand-cocoa/25 bg-bg-dark/60 py-3 text-center text-xs text-text-muted">
          Log in to post to the community feed
        </p>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-text-muted text-center py-4">Loading feed...</div>
        ) : feed.length === 0 ? (
          <div className="text-text-muted text-center py-4 text-sm">No activity yet. Be the first to post!</div>
        ) : (
          feed.map((post, idx) => {
            const id = post._id || post.id || idx;
            const liked = (post.likedBy || []).includes(userId);
            const isOwner = post.userId === userId;
            const commentsOpen = !!openComments[id];
            const commentCount = (post.comments || []).length;

            return (
              <div key={id} className="p-4 rounded-2xl bg-bg-dark/60 border border-border-pink/40 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-text-primary text-sm truncate">{post.userName}</p>
                    <p className="text-[11px] text-text-muted font-mono mt-0.5">{timeAgo(post.createdAt)}</p>
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

                <p className="text-text-primary text-sm leading-relaxed">{post.action}</p>

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
                      <div key={`${id}-c-${i}`} className="rounded-xl rounded-tl-sm border border-border-pink/25 bg-bg-dark/80 px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-text-primary truncate">{c.userName}</p>
                          <p className="shrink-0 text-[10px] text-text-muted font-mono">{timeAgo(c.createdAt)}</p>
                        </div>
                        <p className="mt-0.5 text-xs text-text-muted leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                    {user && (
                      <div className="flex items-center gap-2">
                        <input
                          value={commentDrafts[id] || ''}
                          onChange={(e) => setCommentDrafts({ ...commentDrafts, [id]: e.target.value })}
                          onKeyDown={(e) => {
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
                    )}
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
