import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function CommunityFeed({ user }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

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

  const handleSyncWearable = async () => {
    if (!user) return;
    setSyncing(true);
    try {
      // Mock importing an activity from Apple Watch/Garmin
      const newPost = await api.postFeed({
        userId: user.id,
        userName: user.email.split('@')[0],
        action: 'Synced a 5K Run from Apple Watch 🏃‍♂️'
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
    <div className="bg-card-dark rounded-3xl p-8 border border-brand-cocoa/30 shadow-xl animate-fadeIn h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white">Community Feed</h2>
        <button 
          onClick={handleSyncWearable}
          disabled={syncing}
          className="text-xs bg-bg-dark hover:bg-card-dark border border-brand-cocoa text-brand-cocoa px-4 py-2 rounded-xl transition"
        >
          {syncing ? 'Syncing...' : 'Sync Wearable'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-text-muted text-center py-4">Loading feed...</div>
        ) : feed.length === 0 ? (
          <div className="text-text-muted text-center py-4 text-sm">No activity yet. Sync a wearable to post!</div>
        ) : (
          feed.map((post, idx) => (
            <div key={post._id || idx} className="p-4 rounded-2xl bg-bg-dark/60 border border-border-pink/40 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-brand-pink text-sm">{post.userName}</span>
                  <p className="text-white text-sm mt-1">{post.action}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] text-text-muted font-mono">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => handleLike(post._id)}
                  className="text-xs flex items-center gap-1 text-text-muted hover:text-brand-pink transition"
                >
                  <span>❤️</span> {post.likes || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
