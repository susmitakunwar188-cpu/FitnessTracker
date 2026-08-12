const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const parseJsonResponse = async (res) => {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const getStoredData = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (err) {
    console.warn('Unable to read local dashboard data:', err);
    return fallback;
  }
};

const setStoredData = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Unable to save local dashboard data:', err);
  }
};

const requestWithLocalFallback = async (requestFn, storageKey, fallbackValue) => {
  try {
    const data = await requestFn();
    setStoredData(storageKey, Array.isArray(data) ? data : fallbackValue);
    return data;
  } catch (err) {
    const fallback = getStoredData(storageKey, fallbackValue);
    if (fallback && fallback.length > 0) {
      return fallback;
    }
    throw err;
  }
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Login failed');
    return data;
  },

  async register(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Registration failed');
    return data;
  },

  async getProfile() {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getHeaders()
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch profile');
    return data;
  },

  async updateProfile(stats) {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(stats)
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to update profile');
    return data;
  },

  async forgotPassword(email) {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to submit forgot password request');
    return data;
  },

  async resetPassword(email, token, newPassword) {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, newPassword })
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to reset password');
    return data;
  },

  // Workouts
  async getWorkouts() {
    return requestWithLocalFallback(async () => {
      const res = await fetch(`${API_BASE_URL}/workouts`, {
        headers: getHeaders()
      });
      const data = await parseJsonResponse(res);
      if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch workouts');
      return data;
    }, 'dashboard_workouts', []);
  },

  async createWorkout(name, exercises) {
    const res = await fetch(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, exercises })
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to create workout');
    return data;
  },

  async updateWorkout(id, name, exercises) {
    const res = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ name, exercises })
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to update workout');
    return data;
  },

  async deleteWorkout(id) {
    const res = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to delete workout');
    return data;
  },

  async getWorkoutHistory() {
    return requestWithLocalFallback(async () => {
      const res = await fetch(`${API_BASE_URL}/workouts/history`, {
        headers: getHeaders()
      });
      const data = await parseJsonResponse(res);
      if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch history');
      return data;
    }, 'dashboard_history', []);
  },

  async logWorkoutHistory(workoutName, duration, completedExercises) {
    const res = await fetch(`${API_BASE_URL}/workouts/history`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ workoutName, duration, completedExercises })
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to log workout history');
    return data;
  },

  async clearWorkoutHistory() {
    const res = await fetch(`${API_BASE_URL}/workouts/history/all`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to clear history');
    return data;
  },

  // Features: Nutrition
  async getNutrition(userId, date) {
    const res = await fetch(`${API_BASE_URL}/features/nutrition/${userId}?date=${date}`, {
      headers: getHeaders()
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch nutrition');
    return data;
  },

  async updateNutrition(nutritionData) {
    const res = await fetch(`${API_BASE_URL}/features/nutrition`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(nutritionData)
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to update nutrition');
    return data;
  },

  // Features: Sleep
  async getSleep(userId, date) {
    const res = await fetch(`${API_BASE_URL}/features/sleep/${userId}?date=${date}`, {
      headers: getHeaders()
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch sleep data');
    return data;
  },

  async getSleepWeek(userId) {
    const res = await fetch(`${API_BASE_URL}/features/sleep/${userId}/week`, {
      headers: getHeaders()
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch sleep week');
    return data;
  },

  async updateSleep(sleepData) {
    const res = await fetch(`${API_BASE_URL}/features/sleep`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sleepData)
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to update sleep data');
    return data;
  },

  // Features: Feed
  async getFeed() {
    const res = await fetch(`${API_BASE_URL}/features/feed`, {
      headers: getHeaders()
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch community feed');
    return data;
  },

  async postFeed(feedData) {
    const res = await fetch(`${API_BASE_URL}/features/feed`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(feedData)
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to post to feed');
    return data;
  },

  async likePost(postId) {
    const res = await fetch(`${API_BASE_URL}/features/feed/${postId}/like`, {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to like post');
    return data;
  },

  // Chatbot
  async sendChat(message, history = []) {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to reach the assistant');
    return data;
  }
};
