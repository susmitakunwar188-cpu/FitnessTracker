const getStreakStorageKey = (userId = "guest") => `workout_streak_${userId}`;

export const getStoredWorkoutStreak = (userId = "guest") => {
  if (typeof window === "undefined") {
    return { streak: 0, lastCompletedDate: null };
  }

  try {
    const saved = window.localStorage.getItem(getStreakStorageKey(userId));
    if (!saved) {
      return { streak: 0, lastCompletedDate: null };
    }

    const parsed = JSON.parse(saved);
    return {
      streak: Number(parsed.streak) || 0,
      lastCompletedDate: parsed.lastCompletedDate || null,
    };
  } catch (error) {
    console.warn("Unable to read workout streak:", error);
    return { streak: 0, lastCompletedDate: null };
  }
};

export const awardWorkoutStreak = (userId = "guest") => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const current = getStoredWorkoutStreak(userId);

  if (current.lastCompletedDate === today) {
    return {
      streak: current.streak,
      awarded: false,
      message: "You already earned today’s streak. Keep it going!",
    };
  }

  const nextStreak = current.lastCompletedDate === yesterday ? current.streak + 1 : 1;
  const updated = {
    streak: nextStreak,
    lastCompletedDate: today,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(getStreakStorageKey(userId), JSON.stringify(updated));
  }

  return {
    streak: nextStreak,
    awarded: true,
    message: `Congratulations! You earned a streak. Don't break it! 🔥 Streak ${nextStreak}`,
  };
};
