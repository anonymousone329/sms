import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredAuthUser,
  saveStoredAuthUser,
  getRegisteredUsers,
  saveRegisteredUsers,
} from '../utils/storage';

const AuthContext = createContext();

// Simple encoding helper so passwords aren't stored in plain text
const encodePassword = (pwd) => btoa(pwd);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getStoredAuthUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!foundUser) {
      throw new Error('No account found with this email address.');
    }

    const hashedInput = encodePassword(password);
    if (foundUser.passwordHash !== hashedInput) {
      throw new Error('Incorrect password. Please verify your credentials.');
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role || 'Teacher',
      loginTime: new Date().toISOString(),
    };

    setUser(sessionUser);
    saveStoredAuthUser(sessionUser);
    return sessionUser;
  };

  const register = async ({ name, email, password, role = 'Teacher' }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();

    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      role: role || 'Teacher',
      passwordHash: encodePassword(password),
    };

    const updatedUsers = [...users, newUser];
    saveRegisteredUsers(updatedUsers);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      loginTime: new Date().toISOString(),
    };

    setUser(sessionUser);
    saveStoredAuthUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    setUser(null);
    saveStoredAuthUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
