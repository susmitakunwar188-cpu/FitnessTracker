import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function NutritionTracker({ user }) {
  const [data, setData] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, meals: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) return;
    const fetchNutrition = async () => {
      try {
        setLoading(true);
        const res = await api.getNutrition(user.id, today);
        if (res) setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNutrition();
  }, [user, today]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await api.updateNutrition({ ...data, userId: user.id, date: today });
      alert('Nutrition saved!');
    } catch (err) {
      console.error(err);
      alert('Error saving nutrition');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white text-center py-10">Loading Nutrition...</div>;

  return (
    <div className="bg-card-dark rounded-3xl p-8 border border-brand-cocoa/30 shadow-xl animate-fadeIn">
      <h2 className="text-2xl font-display font-bold text-white mb-6">Daily Nutrition</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase font-quick tracking-wider">Calories</label>
            <input 
              type="number" 
              value={data.calories} 
              onChange={e => setData({...data, calories: Number(e.target.value)})}
              className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-white focus:border-brand-pink focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase font-quick tracking-wider">Protein (g)</label>
            <input 
              type="number" 
              value={data.protein} 
              onChange={e => setData({...data, protein: Number(e.target.value)})}
              className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-white focus:border-brand-pink focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase font-quick tracking-wider">Carbs (g)</label>
            <input 
              type="number" 
              value={data.carbs} 
              onChange={e => setData({...data, carbs: Number(e.target.value)})}
              className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-white focus:border-brand-pink focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase font-quick tracking-wider">Fat (g)</label>
            <input 
              type="number" 
              value={data.fat} 
              onChange={e => setData({...data, fat: Number(e.target.value)})}
              className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-white focus:border-brand-pink focus:outline-none"
            />
          </div>
        </div>
        <button type="submit" disabled={saving} className="glow-button font-display font-bold px-8 py-4 rounded-xl text-base w-full">
          {saving ? 'Saving...' : 'Save Macros'}
        </button>
      </form>
    </div>
  );
}
