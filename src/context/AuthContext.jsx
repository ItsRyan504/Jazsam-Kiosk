import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const API       = 'http://localhost/salespresso-api';
const SESSION_KEY = 'jazsam_user'; // lightweight cache for page-refresh only

async function apiPost(path, body) {
  const res = await fetch(`${API}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function apiPut(path, body) {
  const res = await fetch(`${API}/${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function apiGet(path) {
  const res = await fetch(`${API}/${path}`);
  return res.json();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // On first load use cached session; AuthContext re-syncs from DB on demand
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
    catch { return null; }
  });

  function saveSession(userData) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setUser(userData);
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  /**
   * Register a new customer via the DB API.
   * Returns { success: true } or { success: false, error: '...' }
   */
  async function register({ firstName, lastName, email, phone, password }) {
    try {
      const data = await apiPost('customers.php', {
        action: 'register',
        firstName, lastName, email, phone, password,
      });
      if (!data.success) return { success: false, error: data.error || 'Registration failed.' };
      saveSession(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Could not reach server. Check your connection.' };
    }
  }

  /**
   * Login with email + password via the DB API.
   */
  async function login({ email, password }) {
    try {
      const data = await apiPost('customers.php', { action: 'login', email, password });
      if (!data.success) return { success: false, error: data.error || 'Login failed.' };
      saveSession(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Could not reach server. Check your connection.' };
    }
  }

  function logout() {
    clearSession();
  }

  /**
   * Update the current user's profile fields in DB + local session cache.
   */
  async function updateUser(fields) {
    if (!user) return;
    const merged = { ...user, ...fields };
    // Optimistic local update
    saveSession(merged);
    try {
      await apiPut('customers.php', { id: user.id, ...fields });
    } catch {}
  }

  /**
   * Re-sync points/tier from the DB (call after placing orders, redeeming, etc.)
   */
  async function syncFromDB() {
    if (!user) return;
    try {
      const fresh = await apiGet(`customers.php?id=${encodeURIComponent(user.id)}`);
      if (fresh && fresh.id) saveSession(fresh);
    } catch {}
  }

  function calcTier(points) {
    if (points >= 1500) return 'Gold';
    if (points >= 500)  return 'Silver';
    return 'Bronze';
  }

  /**
   * Add loyalty points and persist to DB.
   */
  async function addPoints(pts) {
    if (!user) return;
    const newPoints = (user.points || 0) + pts;
    const newTier   = calcTier(newPoints);
    await updateUser({ points: newPoints, tier: newTier });
  }

  /**
   * Redeem loyalty points. Returns true on success, false if not enough points.
   */
  async function redeemPoints(pts) {
    if (!user || (user.points || 0) < pts) return false;
    const newPoints = (user.points || 0) - pts;
    const newTier   = calcTier(newPoints);
    await updateUser({ points: newPoints, tier: newTier });
    return true;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, addPoints, redeemPoints, syncFromDB }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
