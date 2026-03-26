import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jazsam_user')) || null; }
    catch { return null; }
  });

  function login(userData) {
    const u = userData || { name: 'Guest', email: 'guest@jazsam.com' };
    localStorage.setItem('jazsam_user', JSON.stringify(u));
    setUser(u);
  }

  function logout() {
    localStorage.removeItem('jazsam_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
