import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../services/api';
import { User } from '../routes/types';

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [tok, rawUser] = await Promise.all([
          AsyncStorage.getItem('@token'),
          AsyncStorage.getItem('@user'),
        ]);
        if (tok) {
          setToken(tok);
          setAuthToken(tok);
        }
        if (rawUser) {
          setUser(JSON.parse(rawUser));
        } else if (tok) {
          await fetchMe(); // revalida usuário
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function fetchMe() {
    const { data } = await api.get<User>('/auth/users/me/');
    setUser(data);
    await AsyncStorage.setItem('@user', JSON.stringify(data));
  }

  async function signIn({ email, password }: { email: string; password: string }) {
    // Djoser Token login
    const { data } = await api.post<{ auth_token: string }>('/auth/token/login/', {
      email,
      password,
    });
    const tok = data.auth_token;
    setToken(tok);
    setAuthToken(tok);
    await AsyncStorage.setItem('@token', tok);
    await fetchMe();
  }

  async function signOut() {
    try {
      await api.post('/auth/token/logout/');
    } catch {
      // ignora erro de logout
    }
    setToken(null);
    setUser(null);
    setAuthToken(null);
    await AsyncStorage.multiRemove(['@token', '@user']);
  }

  async function refreshMe() {
    if (!token) return;
    await fetchMe();
  }

  const value = useMemo(
    () => ({ user, token, loading, signIn, signOut, refreshMe }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
