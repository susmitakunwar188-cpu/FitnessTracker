import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { toast } from '../utils/toast';

const PenIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ImageIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

export default function CommunityFeed({ user }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [draftImage, setDraftImage] = useState(null);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);

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

  const pickImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image is too large. Please choose one under 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => setDraftImage(event.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePost = async () => {
    if (!user || posting) return;
    if (!draftImage) return;
    setPosting(true);
    try {
      const newPost = await api.postFeed({
        userId,
        userName: displayName,
        avatarUrl: user?.avatarUrl || '',
        action: caption.trim(),
        imageUrl: draftImage,
        type: 'social'
      });
      setFeed([newPost, ...feed]);
      setDraftImage(null);
      setCaption('');
    } catch (err) {
      console.error(err);
      toast.error('Error posting to feed');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-card-dark rounded-3xl p-6 border border-brand-cocoa/30 shadow-sm animate-fadeIn flex flex-col">
      {user && (
        <div className="mb-4 rounded-2xl border border-brand-cocoa/25 bg-bg-dark/60 p-3.5">
          <div className="flex items-center gap-2">
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePost();
              }}
              placeholder="Add a caption..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted/70 focus:outline-none"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-dashed px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                draftImage ? 'border-brand-pink/60 text-brand-pink' : 'border-border-pink/40 text-text-muted hover:border-brand-pink hover:text-brand-pink'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              {draftImage ? 'Change' : 'Photo'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={pickImage}
              className="hidden"
            />
            <button
              onClick={handlePost}
              disabled={posting || !draftImage}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-pink px-3.5 py-2 text-xs font-display font-bold text-text-primary transition hover:bg-brand-pink-hover disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              {posting ? 'Posting...' : 'Post'}
              <PenIcon className="h-4 w-4" />
            </button>
          </div>
          {draftImage && (
            <div className="relative mt-2.5">
              <img
                src={draftImage}
                alt="Post preview"
                className="h-36 w-full rounded-xl border border-border-pink/40 object-cover"
              />
              <button
                onClick={() => setDraftImage(null)}
                className="absolute right-2 top-2 rounded-lg bg-black/70 p-1.5 text-text-primary transition hover:bg-red-500/80 cursor-pointer"
                aria-label="Remove picture"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-text-muted text-center py-4">Loading feed...</div>
        ) : feed.length === 0 ? (
          <div className="text-text-muted text-center py-4 text-sm">No photos yet. Share your first one!</div>
        ) : (
          feed.map((post, idx) => {
            const id = post._id || post.id || idx;

            return (
              <div key={id} className="overflow-hidden rounded-2xl bg-bg-dark/60 border border-border-pink/40 flex flex-col">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.action || ''}
                    className="w-full max-h-80 object-cover"
                  />
                )}
                {post.action && (
                  <p className="px-4 py-3 text-sm text-text-primary leading-relaxed">{post.action}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
