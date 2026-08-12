import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { toast } from '../utils/toast';

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

const timeToHours = (t) => {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return h + m / 60;
};

const computeDuration = (bedtime, wakeTime) => {
  const bed = timeToHours(bedtime);
  const wake = timeToHours(wakeTime);
  if (bed === null || wake === null) return 0;
  const diff = wake > bed ? wake - bed : 24 - bed + wake;
  return Math.round(diff * 10) / 10;
};

const getQualityFromHours = (hours) => {
  if (hours <= 0) return 'Good';
  if (hours < 6) return 'Poor';
  if (hours < 7) return 'Fair';
  if (hours <= 9) return 'Good';
  return 'Excellent';
};

const PRESETS = [
  { label: '9:30 PM — 5:30 AM', bedtime: '21:30', wakeTime: '05:30' },
  { label: '10 PM — 6 AM', bedtime: '22:00', wakeTime: '06:00' },
  { label: '10:30 PM — 6:30 AM', bedtime: '22:30', wakeTime: '06:30' },
  { label: '11 PM — 7 AM', bedtime: '23:00', wakeTime: '07:00' },
  { label: '12 AM — 8 AM', bedtime: '00:00', wakeTime: '08:00' }
];

const formatTime = (t) => {
  if (!t) return '--';
  const [h, m] = t.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return '--';
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
};

const formatShortTime = (t) => {
  if (!t) return '--';
  const [h, m] = t.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return '--';
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, '0')} ${period}`;
};

const SleepScheduleChart = ({ days, today }) => {
  const [hovered, setHovered] = useState(null);

  const W = 360;
  const H = 170;
  const PAD_LEFT = 42;
  const PAD_RIGHT = 10;
  const PAD_TOP = 16;
  const PAD_BOTTOM = 28;
  const plotW = W - PAD_LEFT - PAD_RIGHT;
  const plotH = H - PAD_TOP - PAD_BOTTOM;
  const step = plotW / (days.length - 1);
  const x = (i) => PAD_LEFT + i * step;
  const y = (hours) => PAD_TOP + (hours / 24) * plotH;
  const base = PAD_TOP + plotH;

  const BED_COLOR = '#ff2e93';
  const WAKE_COLOR = '#00f0ff';

  const todayIdx = days.findIndex((d) => d.date === today);

  const points = days.map((d, i) => {
    const bedH = timeToHours(d.bedtime);
    const wakeH = timeToHours(d.wakeTime);
    return {
      d,
      i,
      x: x(i),
      bedY: bedH !== null ? y(bedH) : null,
      wakeY: wakeH !== null ? y(wakeH) : null,
      hasBed: bedH !== null,
      hasWake: wakeH !== null
    };
  });

  const makePath = (getY) => points
    .filter((p) => getY(p) !== null)
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${getY(p)}`)
    .join(' ');

  const bedPath = makePath((p) => p.bedY);
  const wakePath = makePath((p) => p.wakeY);
  const hasData = points.some((p) => p.hasBed || p.hasWake);

  const gridRows = [0, 6, 12, 18];
  const gridLabels = { 0: '12 AM', 6: '6 AM', 12: '12 PM', 18: '6 PM' };
  const nightBands = [
    { top: y(0), height: y(8) - y(0) },
    { top: y(20), height: base - y(20) }
  ];

  const tooltipW = 104;
  const tooltipH = 36;

  const hoveredPoint = hovered !== null ? points[hovered] : null;
  const tooltipTop = hoveredPoint ? Math.max(PAD_TOP + 2, Math.min(hoveredPoint.bedY ?? Infinity, hoveredPoint.wakeY ?? Infinity) - 36) : 0;
  const tooltipX = Math.max(PAD_LEFT + tooltipW / 2, Math.min(W - PAD_RIGHT - tooltipW / 2, (hoveredPoint?.x ?? 0) - tooltipW / 2));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      onMouseLeave={() => setHovered(null)}
    >
      {todayIdx >= 0 && (
        <rect
          x={PAD_LEFT + todayIdx * step - step / 2}
          y={PAD_TOP}
          width={step}
          height={plotH}
          fill="#ff2e93"
          opacity="0.06"
          rx="4"
        />
      )}

      {nightBands.map((band, i) => (
        <rect key={i} x={PAD_LEFT} y={band.top} width={plotW} height={band.height} fill="#00f0ff" opacity="0.04" />
      ))}

      {gridRows.map((h) => (
        <g key={h}>
          <line
            x1={PAD_LEFT}
            y1={y(h)}
            x2={W - PAD_RIGHT}
            y2={y(h)}
            stroke="var(--text-muted)"
            strokeOpacity="0.12"
            strokeWidth="1"
            strokeDasharray="2 5"
          />
          <text x={PAD_LEFT - 7} y={y(h) + 3.5} textAnchor="end" fontSize="8.5" fontWeight="600" fill="var(--text-muted)">{gridLabels[h]}</text>
        </g>
      ))}

      {points.map((p) => {
        if (!p.hasBed || !p.hasWake) return null;
        return (
          <line
            key={`window-${p.d.date}`}
            x1={p.x}
            y1={p.bedY}
            x2={p.x}
            y2={p.wakeY}
            stroke={BED_COLOR}
            strokeOpacity="0.25"
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />
        );
      })}

      {bedPath && <path d={bedPath} fill="none" stroke={BED_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
      {wakePath && <path d={wakePath} fill="none" stroke={WAKE_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}

      {!hasData && (
        <text x={PAD_LEFT + plotW / 2} y={PAD_TOP + plotH / 2} textAnchor="middle" fontSize="10" fill="var(--text-muted)">
          Pick a schedule above — your bedtime and wake-up appear instantly
        </text>
      )}

      {points.map((p) => {
        const isToday = p.d.date === today;
        const isHovered = hovered === p.i;
        return (
          <g key={p.d.date} onMouseEnter={() => setHovered(p.i)}>
            {p.hasBed && (
              <g>
                <text x={p.x} y={p.bedY - 8} textAnchor="middle" fontSize="8" fontWeight="700" fill={BED_COLOR}>
                  {formatShortTime(p.d.bedtime)}
                </text>
                <circle
                  cx={p.x}
                  cy={p.bedY}
                  r={isHovered ? 6 : 4.5}
                  fill={BED_COLOR}
                  stroke="var(--card-dark)"
                  strokeWidth="1.5"
                  style={{ transition: 'r 0.15s ease' }}
                />
              </g>
            )}
            {p.hasWake && (
              <g>
                <rect
                  x={p.x - (isHovered ? 4.5 : 3.5)}
                  y={p.wakeY - (isHovered ? 4.5 : 3.5)}
                  width={isHovered ? 9 : 7}
                  height={isHovered ? 9 : 7}
                  rx="1.5"
                  fill={WAKE_COLOR}
                  stroke="var(--card-dark)"
                  strokeWidth="1.5"
                />
                <text x={p.x} y={p.wakeY + 15} textAnchor="middle" fontSize="8" fontWeight="700" fill={WAKE_COLOR}>
                  {formatShortTime(p.d.wakeTime)}
                </text>
              </g>
            )}
            <text
              x={p.x}
              y={H - 10}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight={isToday ? '800' : '600'}
              fill={isToday ? BED_COLOR : 'var(--text-muted)'}
            >
              {p.d.label}
            </text>
          </g>
        );
      })}

      {hoveredPoint && (
        <g>
          <line x1={hoveredPoint.x} y1={PAD_TOP} x2={hoveredPoint.x} y2={base} stroke="var(--text-muted)" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 3" />
          <rect x={tooltipX} y={tooltipTop} width={tooltipW} height={tooltipH} rx="7" fill="var(--card-dark)" stroke="var(--border-pink)" strokeWidth="1" />
          <text x={tooltipX + tooltipW / 2} y={tooltipTop + 13} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={BED_COLOR}>
            Bed {formatTime(hoveredPoint.d.bedtime)}
          </text>
          <text x={tooltipX + tooltipW / 2} y={tooltipTop + 26} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={WAKE_COLOR}>
            Wake {formatTime(hoveredPoint.d.wakeTime)}
          </text>
        </g>
      )}
    </svg>
  );
};

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
    days.push({
      date,
      label,
      hours: match ? Number(match.hours) || 0 : 0,
      bedtime: match?.bedtime || '',
      wakeTime: match?.wakeTime || ''
    });
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
  const [data, setData] = useState({ durationHours: 0, quality: 'Good', recoveryScore: 0, bedtime: '', wakeTime: '' });
  const [week, setWeek] = useState(() => loadWeek(user?.id));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const weekDays = buildWeek(week);
  const loggedDays = weekDays.filter((d) => d.hours > 0);
  const avgHours = loggedDays.length > 0 ? (loggedDays.reduce((sum, d) => sum + d.hours, 0) / loggedDays.length).toFixed(1) : '0';
  const liveHours = computeDuration(data.bedtime, data.wakeTime);
  const liveQuality = getQualityFromHours(liveHours);
  const tip = getTip(data.recoveryScore, liveHours);

  const chartDays = weekDays.map((d) =>
    d.date === today && (data.bedtime || data.wakeTime)
      ? { ...d, bedtime: data.bedtime || d.bedtime, wakeTime: data.wakeTime || d.wakeTime, hours: liveHours > 0 ? liveHours : d.hours }
      : d
  );

  useEffect(() => {
    if (!user) return;
    const fetchSleep = async () => {
      try {
        setLoading(true);
        const res = await api.getSleep(user.id, today);
        if (res) setData({ bedtime: '', wakeTime: '', ...res });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchWeek = async () => {
      try {
        const entries = await api.getSleepWeek(user.id);
        if (!Array.isArray(entries)) return;
        const serverEntries = entries.map((e) => ({
          date: e.date,
          hours: Number(e.durationHours) || 0,
          bedtime: e.bedtime || '',
          wakeTime: e.wakeTime || ''
        }));
        setWeek(prev => {
          const byDate = new Map();
          prev.forEach((e) => byDate.set(e.date, e));
          serverEntries.forEach((e) => byDate.set(e.date, e));
          const merged = Array.from(byDate.values());
          try {
            window.localStorage.setItem(getWeekKey(user.id), JSON.stringify(merged));
          } catch (err) {
            console.error(err);
          }
          return merged;
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchSleep();
    fetchWeek();
  }, [user, today]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!data.bedtime || !data.wakeTime) {
      toast.error('Pick a schedule or set both times');
      return;
    }
    const durationHours = computeDuration(data.bedtime, data.wakeTime);
    const quality = getQualityFromHours(durationHours);
    setSaving(true);
    try {
      const res = await api.updateSleep({ ...data, durationHours, quality, userId: user.id, date: today });
      setData(prev => ({ ...prev, durationHours, quality, recoveryScore: res.recoveryScore }));
      const nextWeek = [...week.filter((entry) => entry.date !== today), { date: today, hours: durationHours, bedtime: data.bedtime, wakeTime: data.wakeTime }];
      setWeek(nextWeek);
      try {
        window.localStorage.setItem(getWeekKey(user.id), JSON.stringify(nextWeek));
      } catch (err) {
        console.error(err);
      }
      toast.success('Sleep schedule saved!');
    } catch (err) {
      console.error(err);
      toast.error('Error saving sleep data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-text-primary text-center py-8">Loading Recovery...</div>;

  return (
    <div className="bg-card-dark rounded-3xl p-6 border border-brand-cocoa/30 shadow-sm animate-fadeIn">
      <div className="mb-5 flex items-center gap-3 border-b border-border-pink/30 pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-pink/25 bg-brand-pink/10">
          <MoonIcon />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-text-primary leading-none">Sleep & Recovery</h2>
          <p className="mt-1 text-xs text-text-muted">Log your rest and track your readiness</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {data.recoveryScore > 0 ? (
          <div className="rounded-2xl border border-brand-pink/50 bg-bg-dark p-5 text-center">
            <p className="mb-2 flex items-center justify-center gap-1.5 text-[11px] text-text-muted font-quick font-bold tracking-widest uppercase">
              <GaugeIcon className="h-4 w-4 text-brand-pink" /> Readiness Score
            </p>
            <p className={`text-5xl font-display font-extrabold ${data.recoveryScore >= 80 ? 'text-green-400' : data.recoveryScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              {data.recoveryScore}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border-pink/40 bg-bg-dark p-5 text-center">
            <p className="mb-2 text-[11px] text-text-muted font-quick font-bold tracking-widest uppercase">Readiness</p>
            <p className="font-display text-5xl font-bold text-text-muted">--</p>
          </div>
        )}

        <div className="rounded-2xl border border-border-pink/40 bg-bg-dark p-5 text-center">
          <p className="mb-2 flex items-center justify-center gap-1.5 text-[11px] text-text-muted font-quick font-bold tracking-widest uppercase">
            <TrendIcon className="h-4 w-4 text-brand-pink" /> Weekly Average
          </p>
          <p className="font-display text-5xl font-extrabold text-accent-cocoa-light">{avgHours}<span className="text-lg text-text-muted">h</span></p>
        </div>

        <div className="rounded-2xl border border-brand-pink/40 bg-bg-dark p-5 text-center">
          <p className="mb-2 flex items-center justify-center gap-1.5 text-[11px] text-text-muted font-quick font-bold tracking-widest uppercase">
            <BedIcon className="h-4 w-4 text-brand-pink" /> Last Night
          </p>
          <p className="font-display text-5xl font-extrabold text-text-primary">
            {liveHours > 0 ? liveHours : '--'}
            {liveHours > 0 && <span className="text-lg text-text-muted">h</span>}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border-pink/40 bg-bg-dark/60 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted font-quick">
            <TrendIcon className="h-4 w-4 text-brand-pink" /> 7-Day Sleep Schedule
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-pink" /> Bed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-brand-cocoa" /> Wake
            </span>
          </div>
        </div>
        <div className="flex h-56 items-center rounded-lg bg-bg-dark/40 px-3 py-2 sm:h-72">
          <SleepScheduleChart days={chartDays} today={today} />
        </div>
      </div>

      <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-brand-pink/25 bg-brand-pink/5 p-5">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-pink" />
        <div>
          <p className="mb-0.5 text-[11px] font-bold uppercase tracking-widest text-text-muted font-quick">Coach Tip</p>
          <p className="text-sm leading-relaxed text-text-primary">{tip}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase font-quick tracking-wider">
            <MoonIcon className="h-4 w-4 text-brand-pink" /> Quick Schedule
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = data.bedtime === p.bedtime && data.wakeTime === p.wakeTime;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setData({ ...data, bedtime: p.bedtime, wakeTime: p.wakeTime })}
                  className={`rounded-full px-4 py-2.5 text-xs font-bold transition-colors ${active
                    ? 'bg-brand-pink text-white shadow-sm'
                    : 'border border-border-pink bg-bg-dark text-text-muted hover:border-brand-pink hover:text-text-primary'}`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase font-quick tracking-wider">
              <BedIcon className="h-4 w-4 text-brand-pink" /> Bedtime
            </label>
            <input
              type="time"
              value={data.bedtime}
              onChange={e => setData({ ...data, bedtime: e.target.value })}
              className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-text-primary focus:border-brand-pink focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase font-quick tracking-wider">
              <TrendIcon className="h-4 w-4 text-brand-pink" /> Wake-Up
            </label>
            <input
              type="time"
              value={data.wakeTime}
              onChange={e => setData({ ...data, wakeTime: e.target.value })}
              className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-text-primary focus:border-brand-pink focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-brand-pink/30 bg-brand-pink/5 p-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:justify-start">
            <div className="text-center sm:text-left">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-text-muted font-quick">Hours Slept</p>
              <p className="font-display text-5xl font-extrabold text-brand-pink">
                {liveHours > 0 ? liveHours : '--'}
                {liveHours > 0 && <span className="text-lg text-text-muted">h</span>}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-text-muted font-quick">Quality</p>
              <p className="font-display text-3xl font-bold text-accent-cocoa-light">
                {liveHours > 0 ? liveQuality : '--'}
              </p>
            </div>
          </div>
          <p className="mt-4 border-t border-brand-pink/20 pt-3 text-center text-sm leading-relaxed text-text-muted sm:text-left">
            Pick a preset or set your own times — duration and quality are calculated automatically. Your schedule appears on the graph instantly.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving || !data.bedtime || !data.wakeTime}
          className="glow-button-cocoa font-display font-bold px-8 py-4 rounded-xl text-base w-full disabled:opacity-50"
        >
          {saving ? 'Calculating...' : 'Save Today\'s Sleep'}
        </button>
      </form>
    </div>
  );
}
