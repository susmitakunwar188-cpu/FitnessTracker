import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function RecoveryTracker({ user }) {
  const [data, setData] = useState({ durationHours: 0, quality: 'Good', recoveryScore: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) return;
    const fetchSleep = async () => {
      try {
        setLoading(true);
        const res = await api.getSleep(user.id, today);
        if (res) setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSleep();
  }, [user, today]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const res = await api.updateSleep({ ...data, userId: user.id, date: today });
      setData(prev => ({ ...prev, recoveryScore: res.recoveryScore }));
      alert('Sleep data logged!');
    } catch (err) {
      console.error(err);
      alert('Error saving sleep data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white text-center py-10">Loading Recovery...</div>;

  return (
    <div className="bg-card-dark rounded-3xl p-8 border border-brand-cocoa/30 shadow-xl animate-fadeIn">
      <h2 className="text-2xl font-display font-bold text-white mb-6">Sleep & Recovery</h2>
      
      {data.recoveryScore > 0 && (
        <div className="mb-8 text-center p-6 rounded-2xl bg-bg-dark border border-brand-pink/50">
          <p className="text-sm text-text-muted font-quick font-bold tracking-widest uppercase mb-2">Readiness Score</p>
          <p className={`text-6xl font-display font-extrabold ${data.recoveryScore >= 80 ? 'text-green-400' : data.recoveryScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
            {data.recoveryScore}
          </p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-text-muted mb-2 uppercase font-quick tracking-wider">Hours Slept</label>
          <input 
            type="number" 
            step="0.5"
            value={data.durationHours} 
            onChange={e => setData({...data, durationHours: Number(e.target.value)})}
            className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-white focus:border-brand-pink focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted mb-2 uppercase font-quick tracking-wider">Sleep Quality</label>
          <select 
            value={data.quality}
            onChange={e => setData({...data, quality: e.target.value})}
            className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-white focus:border-brand-pink focus:outline-none"
          >
            <option value="Poor">Poor</option>
            <option value="Fair">Fair</option>
            <option value="Good">Good</option>
            <option value="Excellent">Excellent</option>
          </select>
        </div>
        <button type="submit" disabled={saving} className="glow-button-cocoa font-display font-bold px-8 py-4 rounded-xl text-base w-full">
          {saving ? 'Calculating...' : 'Calculate Recovery'}
        </button>
      </form>
    </div>
  );
}
