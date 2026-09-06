import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MOCK_USERS } from '../data/mockUsers';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('wm_users', MOCK_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage('wm_currentUser', MOCK_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('wm_isAuthenticated', true);

  // Synchronize updated mock user names with existing localStorage cache
  React.useEffect(() => {
    setUsers(prev => {
      let changed = false;
      const updated = prev.map(u => {
        const fresh = MOCK_USERS.find(m => m.id === u.id);
        if (fresh && (fresh.name !== u.name || fresh.email !== u.email)) {
          changed = true;
          return { ...u, name: fresh.name, email: fresh.email };
        }
        return u;
      });
      return changed ? updated : prev;
    });

    setCurrentUser(curr => {
      if (!curr) return MOCK_USERS[0];
      const fresh = MOCK_USERS.find(m => m.id === curr.id);
      if (fresh && (fresh.name !== curr.name || fresh.email !== curr.email)) {
        return { ...curr, name: fresh.name, email: fresh.email };
      }
      return curr;
    });
  }, [setUsers, setCurrentUser]);

  const login = useCallback((email) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'User not found with this email' };
  }, [users, setCurrentUser, setIsAuthenticated]);

  const signup = useCallback(({ name, email, role = 'Member', title = 'Product Team' }) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, error: 'Email already exists' };
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      title,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    };
    const updated = [...users, newUser];
    setUsers(updated);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return { success: true, user: newUser };
  }, [users, setUsers, setCurrentUser, setIsAuthenticated]);

  const switchUser = useCallback((userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users, setCurrentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, [setCurrentUser, setIsAuthenticated]);

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      isAuthenticated,
      login,
      signup,
      switchUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
