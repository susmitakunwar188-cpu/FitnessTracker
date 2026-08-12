import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';

const NutritionIcon = ({ className = "h-6 w-6 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 3C7 3 4 7.5 4 12c0 5 3.5 9 8.5 9 3 0 5.5-2 5.5-5 0-1.8-1-3-2.5-4 0-3 0-6-2.5-9Z" />
    <path d="M15 3h5v5" />
  </svg>
);

const FlameIcon = ({ className = "h-4 w-4 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c4 0 7-3.1 7-7 0-5-5-8-7-13-2 5-7 8-7 13 0 3.9 3 7 7 7Z" />
  </svg>
);

const EggIcon = ({ className = "h-4 w-4 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c3.5 0 6 2.6 6 6.2 0 4.3-2.8 7.3-6 7.3s-6-3-6-7.3C6 5.6 8.5 3 12 3Z" />
  </svg>
);

const WheatIcon = ({ className = "h-4 w-4 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const DropletIcon = ({ className = "h-4 w-4 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const TargetIcon = ({ className = "h-4 w-4 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const PlusIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const TrashIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const AlertIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const InfoIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const getGoals = (user) => {
  const w = Number(user?.weight) || 0;
  const h = Number(user?.height) || 0;
  const age = Number(user?.age) || 0;
  let calories = 2000;
  let protein = 120;
  if (w > 0 && h > 0 && age > 0) {
    const bmr = 10 * w + 6.25 * h - 5 * age + 5;
    calories = Math.round(bmr * 1.375);
    protein = Math.round(w * 1.8);
  } else if (w > 0) {
    calories = Math.round(w * 33);
    protein = Math.round(w * 1.8);
  }
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { calories, protein, carbs, fat };
};

const MacroBar = ({ label, icon, value, goal, barClass }) => {
  const pct = goal > 0 ? Math.min(Math.round((value / goal) * 100), 100) : 0;
  return (
    <div className="rounded-2xl border border-border-pink/40 bg-bg-dark/60 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase font-quick tracking-wider">
          {icon}
          {label}
        </span>
        <span className="font-mono text-xs font-semibold text-white">{value} / {goal}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-dark">
        <div className={`h-full rounded-full bg-gradient-to-r ${barClass} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-right text-[10px] font-semibold text-text-muted/70">{pct}% of goal</p>
    </div>
  );
};

const GoalBanner = ({ remaining, goal }) => {
  let config;
  if (remaining < 0) {
    config = {
      style: 'border-red-500/40 bg-red-500/10 text-red-300',
      icon: <AlertIcon className="h-5 w-5 shrink-0 text-red-400" />,
      title: 'You went above your macros!',
      subtitle: `${Math.abs(remaining)} kcal over your ${goal} kcal goal. Consider a lighter next meal or an extra walk.`
    };
  } else if (remaining === 0) {
    config = {
      style: 'border-green-500/40 bg-green-500/10 text-green-300',
      icon: <CheckIcon className="h-5 w-5 shrink-0 text-green-400" />,
      title: 'Goal reached!',
      subtitle: `You hit your ${goal} kcal target for today. Perfect.`
    };
  } else {
    config = {
      style: 'border-brand-pink/30 bg-brand-pink/5 text-white',
      icon: <InfoIcon className="h-5 w-5 shrink-0 text-brand-pink" />,
      title: "You haven't hit your macros yet!",
      subtitle: `${remaining} kcal left to reach your ${goal} kcal goal. Keep fueling.`
    };
  }
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${config.style}`}>
      {config.icon}
      <div>
        <p className="font-display font-bold text-sm">{config.title}</p>
        <p className="mt-0.5 text-xs opacity-90 leading-relaxed">{config.subtitle}</p>
      </div>
    </div>
  );
};

export default function NutritionTracker({ user }) {
  const [data, setData] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, meals: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState(null); // 'saving' | 'saved' | 'error'
  const [mealForm, setMealForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const saveTimer = useRef(null);

  const today = new Date().toISOString().split('T')[0];
  const goals = getGoals(user);
  const remaining = goals.calories - data.calories;
  const pct = goals.calories > 0 ? Math.min(Math.round((data.calories / goals.calories) * 100), 100) : 0;
  const RING_R = 64;
  const RING_C = 2 * Math.PI * RING_R;
  const ringOffset = RING_C - (pct / 100) * RING_C;
  const overGoal = remaining < 0;

  useEffect(() => {
    if (!user) return;
    const fetchNutrition = async () => {
      try {
        setLoading(true);
        const res = await api.getNutrition(user.id, today);
        if (res) setData({ meals: [], ...res });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNutrition();
  }, [user, today]);

  const persist = (next) => {
    setData(next);
    setSaving(true);
    setSaveState('saving');
    api.updateNutrition({ ...next, userId: user.id, date: today })
      .then(() => {
        setSaveState('saved');
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => setSaveState(null), 4000);
      })
      .catch((err) => {
        console.error(err);
        setSaveState('error');
      })
      .finally(() => setSaving(false));
  };

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const addMeal = () => {
    if (!mealForm.name.trim()) return;
    const meal = {
      name: mealForm.name.trim(),
      calories: Number(mealForm.calories) || 0,
      protein: Number(mealForm.protein) || 0,
      carbs: Number(mealForm.carbs) || 0,
      fat: Number(mealForm.fat) || 0
    };
    persist({
      calories: data.calories + meal.calories,
      protein: data.protein + meal.protein,
      carbs: data.carbs + meal.carbs,
      fat: data.fat + meal.fat,
      meals: [...data.meals, meal]
    });
    setMealForm({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  const removeMeal = (idx) => {
    const meal = data.meals[idx];
    if (!meal) return;
    persist({
      calories: Math.max(data.calories - meal.calories, 0),
      protein: Math.max(data.protein - meal.protein, 0),
      carbs: Math.max(data.carbs - meal.carbs, 0),
      fat: Math.max(data.fat - meal.fat, 0),
      meals: data.meals.filter((_, i) => i !== idx)
    });
  };

  if (loading) return <div className="text-white text-center py-8">Loading Nutrition...</div>;

  return (
    <div className="bg-card-dark rounded-3xl p-6 border border-brand-cocoa/30 shadow-xl animate-fadeIn">
      <div className="mb-5 flex items-center gap-3 border-b border-border-pink/30 pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-pink/25 bg-brand-pink/10">
          <NutritionIcon />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-white leading-none">Daily Nutrition</h2>
          <p className="mt-1 text-xs text-text-muted">Track calories, macros, and meals for today</p>
        </div>
        <span className="ml-auto text-xs text-text-muted font-mono">{today}</span>
      </div>

      <GoalBanner remaining={remaining} goal={goals.calories} />

      <div className="mb-5 mt-5 flex flex-col items-center gap-5 md:flex-row md:items-center">
        <div className="flex flex-col items-center">
          <div className="relative h-44 w-44">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id="calRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff2e93" />
                  <stop offset="100%" stopColor="#8c5a35" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r={RING_R} fill="none" strokeWidth="14" className="stroke-bg-dark" />
              <circle
                cx="80"
                cy="80"
                r={RING_R}
                fill="none"
                strokeWidth="14"
                strokeLinecap="round"
                stroke={overGoal ? '#ef4444' : 'url(#calRingGrad)'}
                strokeDasharray={RING_C}
                strokeDashoffset={ringOffset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className={`font-display text-4xl font-extrabold ${overGoal ? 'text-red-400' : remaining === 0 ? 'text-green-400' : 'text-white'}`}>
                {overGoal ? Math.abs(remaining) : remaining}
              </p>
              <p className={`text-[10px] font-bold uppercase tracking-widest font-quick ${overGoal ? 'text-red-400/80' : 'text-text-muted'}`}>
                {overGoal ? 'kcal over' : remaining === 0 ? 'goal met' : 'kcal left'}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-text-muted">{pct}% of {goals.calories} kcal goal</p>
        </div>
        <div className="grid w-full flex-1 grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-pink/25 bg-brand-pink/10 p-5 text-center">
            <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-text-muted font-quick">
              <TargetIcon className="h-3.5 w-3.5" /> Target
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-white">{goals.calories}</p>
            <p className="text-[10px] font-semibold text-text-muted">kcal / day</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-cocoa/25 bg-brand-cocoa/10 p-5 text-center">
            <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-text-muted font-quick">
              <FlameIcon className="h-3.5 w-3.5" /> Consumed
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-brand-cocoa-light">{data.calories}</p>
            <p className="text-[10px] font-semibold text-text-muted">kcal today</p>
          </div>
          <div className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border border-border-pink/40 bg-bg-dark/60 p-4">
            <p className="text-xs font-semibold text-text-muted">
              {overGoal
                ? `You're ${Math.abs(remaining)} kcal over today's target.`
                : remaining === 0
                  ? "You've exactly hit your calorie target!"
                  : `${remaining} kcal remaining for the rest of the day.`}
            </p>
          </div>
        </div>
      </div>
      <p className="mb-5 text-[11px] text-text-muted/70">Daily goal is auto-estimated from your profile stats (age, weight, height) — defaults to 2000 kcal.</p>

      <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MacroBar label="Calories" icon={<FlameIcon />} value={data.calories} goal={goals.calories} barClass="from-brand-pink to-brand-pink-hover" />
        <MacroBar label="Protein" icon={<EggIcon />} value={data.protein} goal={goals.protein} barClass="from-green-500 to-green-400" />
        <MacroBar label="Carbs" icon={<WheatIcon />} value={data.carbs} goal={goals.carbs} barClass="from-amber-500 to-yellow-400" />
        <MacroBar label="Fat" icon={<DropletIcon />} value={data.fat} goal={goals.fat} barClass="from-brand-cocoa to-brand-cocoa-hover" />
      </div>

      <div className="mb-5 rounded-2xl border border-border-pink/40 bg-bg-dark/60 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-muted font-quick">Add Meal</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <input
            value={mealForm.name}
            onChange={e => setMealForm({ ...mealForm, name: e.target.value })}
            placeholder="Meal name"
            className="glow-input col-span-2 border-2 border-border-pink rounded-xl p-2.5 bg-bg-dark text-white text-sm focus:border-brand-pink focus:outline-none sm:col-span-1"
          />
          <input
            type="number"
            value={mealForm.calories}
            onChange={e => setMealForm({ ...mealForm, calories: e.target.value })}
            placeholder="kcal"
            className="glow-input border-2 border-border-pink rounded-xl p-2.5 bg-bg-dark text-white text-sm focus:border-brand-pink focus:outline-none"
          />
          <input
            type="number"
            value={mealForm.protein}
            onChange={e => setMealForm({ ...mealForm, protein: e.target.value })}
            placeholder="protein"
            className="glow-input border-2 border-border-pink rounded-xl p-2.5 bg-bg-dark text-white text-sm focus:border-brand-pink focus:outline-none"
          />
          <input
            type="number"
            value={mealForm.carbs}
            onChange={e => setMealForm({ ...mealForm, carbs: e.target.value })}
            placeholder="carbs"
            className="glow-input border-2 border-border-pink rounded-xl p-2.5 bg-bg-dark text-white text-sm focus:border-brand-pink focus:outline-none"
          />
          <input
            type="number"
            value={mealForm.fat}
            onChange={e => setMealForm({ ...mealForm, fat: e.target.value })}
            placeholder="fat"
            className="glow-input border-2 border-border-pink rounded-xl p-2.5 bg-bg-dark text-white text-sm focus:border-brand-pink focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={addMeal}
          disabled={!mealForm.name.trim() || saving}
          className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-brand-pink px-4 py-2 text-xs font-display font-bold text-white transition hover:bg-brand-pink-hover disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          <PlusIcon className="h-4 w-4" /> {saving ? 'Saving...' : 'Add Meal'}
        </button>
      </div>

      <div className="mb-5 overflow-hidden rounded-2xl border border-border-pink/40 bg-bg-dark/30">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-bg-dark/90">
            <tr className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-quick">
              <th className="px-4 py-3 text-left">Meal</th>
              <th className="px-4 py-3 text-right">Calories<span className="ml-1 text-[9px] font-semibold normal-case text-text-muted/60">/ {goals.calories}</span></th>
              <th className="px-4 py-3 text-right">Protein<span className="ml-1 text-[9px] font-semibold normal-case text-text-muted/60">/ {goals.protein}g</span></th>
              <th className="px-4 py-3 text-right">Carbs<span className="ml-1 text-[9px] font-semibold normal-case text-text-muted/60">/ {goals.carbs}g</span></th>
              <th className="px-4 py-3 text-right">Fat<span className="ml-1 text-[9px] font-semibold normal-case text-text-muted/60">/ {goals.fat}g</span></th>
              <th className="px-4 py-3 text-right" />
            </tr>
          </thead>
          <tbody>
            {data.meals.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-xs text-text-muted">No meals logged yet today. Add your breakfast, lunch, or dinner above.</td>
              </tr>
            )}
            {data.meals.map((meal, idx) => (
              <tr key={idx} className={`border-t border-border-pink/20 ${idx % 2 === 1 ? 'bg-bg-dark/40' : 'bg-transparent'}`}>
                <td className="px-4 py-3 font-display font-bold text-white">{meal.name}</td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-white tabular-nums">{meal.calories}</td>
                <td className="px-4 py-3 text-right font-mono text-green-400 tabular-nums">{meal.protein}g</td>
                <td className="px-4 py-3 text-right font-mono text-amber-400 tabular-nums">{meal.carbs}g</td>
                <td className="px-4 py-3 text-right font-mono text-brand-cocoa-light tabular-nums">{meal.fat}g</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeMeal(idx)}
                    className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                    aria-label={`Remove ${meal.name}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {data.meals.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-brand-pink/50 bg-brand-pink/10 font-display font-bold text-white">
                <td className="px-4 py-3.5 uppercase tracking-widest text-[11px] font-quick text-text-muted">Totals</td>
                <td className={`px-4 py-3.5 text-right font-mono text-base font-bold tabular-nums ${overGoal ? 'text-red-400' : 'text-green-400'}`}>{data.calories}</td>
                <td className="px-4 py-3.5 text-right font-mono text-base text-green-400 tabular-nums">{data.protein}g</td>
                <td className="px-4 py-3.5 text-right font-mono text-base text-amber-400 tabular-nums">{data.carbs}g</td>
                <td className="px-4 py-3.5 text-right font-mono text-base text-brand-cocoa-light tabular-nums">{data.fat}g</td>
                <td className="px-4 py-3.5" />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <p className="text-right text-[11px] font-semibold text-text-muted">
        {saveState === 'saving' && 'Saving...'}
        {saveState === 'saved' && <span className="text-green-400">Saved to your daily log.</span>}
        {saveState === 'error' && <span className="text-red-400">Failed to save — check your connection.</span>}
        {saveState === null && 'Changes save automatically.'}
      </p>
    </div>
  );
}
