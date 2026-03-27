import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

/* ── Helper: registered users store in localStorage ── */
const USERS_KEY = 'jazsam_users';
const SESSION_KEY = 'jazsam_user';

function getRegisteredUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
    catch { return null; }
  });

  /**
   * Register a new user.
   * Returns { success: true } or { success: false, error: '...' }
   */
  function register({ firstName, lastName, email, phone, password }) {
    const users = getRegisteredUsers();

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: `${firstName} ${lastName}`.trim(),
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: phone || '',
      password, // In a real app this would be hashed
      points: 0,
      tier: 'Bronze',
      joinedAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    // Auto-login after registration
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);

    return { success: true };
  }

  /**
   * Login with email + password.
   * Returns { success: true } or { success: false, error: '...' }
   */
  function login({ email, password }) {
    const users = getRegisteredUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!found) {
      return { success: false, error: 'No account found with this email.' };
    }

    if (found.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const sessionUser = { ...found };
    delete sessionUser.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  function updateUser(fields) {
    const updated = { ...user, ...fields };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    setUser(updated);

    // Also update the registered users store
    const users = getRegisteredUsers();
    const idx = users.findIndex(u => u.id === updated.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...fields };
      saveRegisteredUsers(users);
    }
  }

  /**
   * Add reward points to the current user.
   */
  function addPoints(pts) {
    if (!user) return;
    const newPoints = (user.points || 0) + pts;
    let newTier = user.tier || 'Bronze';
    if (newPoints >= 1500) newTier = 'Gold';
    else if (newPoints >= 500) newTier = 'Silver';
    else newTier = 'Bronze';

    updateUser({ points: newPoints, tier: newTier });
  }

  /**
   * Redeem reward points.
   * Returns true if successful, false if not enough points.
   */
  function redeemPoints(pts) {
    if (!user || (user.points || 0) < pts) return false;
    const newPoints = (user.points || 0) - pts;
    let newTier = user.tier || 'Bronze';
    if (newPoints >= 1500) newTier = 'Gold';
    else if (newPoints >= 500) newTier = 'Silver';
    else newTier = 'Bronze';

    updateUser({ points: newPoints, tier: newTier });
    return true;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, addPoints, redeemPoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
