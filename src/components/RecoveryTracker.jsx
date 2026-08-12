import { useState, useEffect } from 'react';
import { api } from '../utils/api';

const MoonIcon = ({ className = "h-6 w-6 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const BedIcon = ({ className = "h-4 w-4 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </svg>
);

const GaugeIcon = ({ className = "h-4 w-4 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 14l4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </svg>
);

const TrendIcon = ({ className = "h-4 w-4 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const InfoIcon = ({ className = "h-4 w-4 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const getWeekKey = (userId) => `sleep_week_${userId || 'guest'}`;

const loadWeek = (userId) => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = window.localStorage.getItem(getWeekKey(userId));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const buildWeek = (entries) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const date = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const match = entries.find((e) => e.date === date);
    days.push({ date, label, hours: match ? Number(match.hours) : 0 });
  }
  return days;
};

const getTip = (score, hours) => {
  if (score > 0) {
    if (score >= 80) return 'Excellent readiness! Your body is primed — go hard in the gym today.';
    if (score >= 60) return 'Solid recovery. Keep your routine steady and stay consistent.';
    if (score >= 40) return 'Moderate readiness. Focus on technique and keep intensity controlled.';
    return 'Low readiness. Take a rest day, hydrate well, and aim for 8+ hours of sleep.';
  }
  if (hours > 0) {
    if (hours < 6) return 'You are under-sleeping. Aim for at least 7 hours for proper recovery.';
    if (hours <= 7) return 'Good. Try to bump this to 8 hours for optimal muscle recovery.';
    if (hours <= 9) return 'Great sleep window. Keep the schedule consistent.';
    return 'Plenty of rest. Watch that oversleeping does not drain your energy.';
  }
  return "Log tonight's sleep to get a personalized readiness score and coach tip.";
};

export default function RecoveryTracker({ user }) {
  const [data, setData] = useState({ durationHours: 0, quality: 'Good', recoveryScore: 0 });
  const [week, setWeek] = useState(() => loadWeek(user?.id));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const weekDays = buildWeek(week);
  const loggedDays = weekDays.filter((d) => d.hours > 0);
  const avgHours = loggedDays.length > 0 ? (loggedDays.reduce((sum, d) => sum + d.hours, 0) / loggedDays.length).toFixed(1) : '0';
  const tip = getTip(data.recoveryScore, data.durationHours);

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
      const nextWeek = [...week.filter((entry) => entry.date !== today), { date: today, hours: data.durationHours }];
      setWeek(nextWeek);
      try {
        window.localStorage.setItem(getWeekKey(user.id), JSON.stringify(nextWeek));
      } catch (err) {
        console.error(err);
      }
      alert('Sleep data logged!');
    } catch (err) {
      console.error(err);
      alert('Error saving sleep data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white text-center py-8">Loading Recovery...</div>;

  return (
    <div className="bg-card-dark rounded-3xl p-6 border border-brand-cocoa/30 shadow-xl animate-fadeIn">
      <div className="mb-5 flex items-center gap-3 border-b border-border-pink/30 pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-pink/25 bg-brand-pink/10">
          <MoonIcon />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-white leading-none">Sleep & Recovery</h2>
          <p className="mt-1 text-xs text-text-muted">Log your rest and track your readiness</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {data.recoveryScore > 0 ? (
          <div className="rounded-2xl border border-brand-pink/50 bg-bg-dark p-5 text-center">
            <p className="mb-2 flex items-center justify-center gap-1.5 text-[10px] text-text-muted font-quick font-bold tracking-widest uppercase">
              <GaugeIcon className="h-4 w-4 text-brand-pink" /> Readiness Score
            </p>
            <p className={`text-5xl font-display font-extrabold ${data.recoveryScore >= 80 ? 'text-green-400' : data.recoveryScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              {data.recoveryScore}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border-pink/40 bg-bg-dark p-5 text-center">
            <p className="mb-2 text-[10px] text-text-muted font-quick font-bold tracking-widest uppercase">Readiness</p>
            <p className="font-display text-5xl font-bold text-text-muted">--</p>
          </div>
        )}

        <div className="rounded-2xl border border-border-pink/40 bg-bg-dark p-5 text-center">
          <p className="mb-2 flex items-center justify-center gap-1.5 text-[10px] text-text-muted font-quick font-bold tracking-widest uppercase">
            <TrendIcon className="h-4 w-4 text-brand-pink" /> Weekly Average
          </p>
          <p className="font-display text-5xl font-extrabold text-brand-cocoa-light">{avgHours}<span className="text-lg text-text-muted">h</span></p>
        </div>

        <div className="rounded-2xl border border-brand-pink/40 bg-bg-dark p-5 text-center">
          <p className="mb-2 flex items-center justify-center gap-1.5 text-[10px] text-text-muted font-quick font-bold tracking-widest uppercase">
            <BedIcon className="h-4 w-4 text-brand-pink" /> Last Night
          </p>
          <p className="font-display text-5xl font-extrabold text-white">
            {data.durationHours > 0 ? data.durationHours : '--'}
            {data.durationHours > 0 && <span className="text-lg text-text-muted">h</span>}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-border-pink/40 bg-bg-dark/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted font-quick">
            <TrendIcon className="h-4 w-4 text-brand-pink" /> 7-Day Sleep Trend
          </p>
          <p className="text-xs font-semibold text-text-muted">Target: 7-9h</p>
        </div>
        <div className="flex h-32 items-end gap-2">
          {weekDays.map((d) => (
            <div key={d.date} className={`flex h-full flex-1 flex-col items-center justify-end gap-1.5 rounded-lg ${d.date === today ? 'bg-brand-pink/5' : ''}`}>
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  d.hours >= 7 && d.hours <= 9
                    ? 'bg-gradient-to-t from-green-500/80 to-green-400/80'
                    : 'bg-gradient-to-t from-brand-cocoa/70 to-brand-pink/80'
                }`}
                style={{ height: `${d.hours > 0 ? Math.min((d.hours / 10) * 100, 100) : 4}%` }}
                title={`${d.label}: ${d.hours}h`}
              />
              <span className={`text-[9px] font-bold uppercase ${d.date === today ? 'text-brand-pink' : 'text-text-muted'}`}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-brand-pink/25 bg-brand-pink/5 p-4">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-pink" />
        <div>
          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-text-muted font-quick">Coach Tip</p>
          <p className="text-sm leading-relaxed text-white">{tip}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase font-quick tracking-wider">
              <BedIcon className="h-4 w-4 text-brand-pink" /> Hours Slept
            </label>
            <input
              type="number"
              step="0.5"
              value={data.durationHours}
              onChange={e => setData({ ...data, durationHours: Number(e.target.value) })}
              className="glow-input font-sans border-2 border-border-pink rounded-xl p-3.5 w-full bg-bg-dark text-white focus:border-brand-pink focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase font-quick tracking-wider">
              <GaugeIcon className="h-4 w-4 text-brand-pink" /> Sleep Quality
            </label>
            <select
              value={data.quality}
              onChange={e => setData({ ...data, quality: e.target.value })}
              className="glow-input font-sans border-2 border-border-pink rounded-xl p-3.5 w-full bg-bg-dark text-white focus:border-brand-pink focus:outline-none"
            >
              <option value="Poor">Poor</option>
              <option value="Fair">Fair</option>
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={saving} className="glow-button-cocoa font-display font-bold px-8 py-3.5 rounded-xl text-base w-full">
          {saving ? 'Calculating...' : 'Calculate Recovery'}
        </button>
      </form>
    </div>
  );
}
