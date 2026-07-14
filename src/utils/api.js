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
    const res = await fetch(`${API_BASE_URL}/workouts`, {
      headers: getHeaders()
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch workouts');
    return data;
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
  }
};
