import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

interface AuthContextProps {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorage = async () => {
      const storedToken = await AsyncStorage.getItem('@token');
      const storedUser = await AsyncStorage.getItem('@user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
      setLoading(false);
    };
    loadStorage();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/jwt/create/', { username, password });
      const access = response.data.access;
      const refresh = response.data.refresh;

      setToken(access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      const userResponse = await api.get('/auth/users/me/');
      setUser(userResponse.data);

      await AsyncStorage.setItem('@token', access);
      await AsyncStorage.setItem('@refresh', refresh);
      await AsyncStorage.setItem('@user', JSON.stringify(userResponse.data));
    } catch (error) {
      console.error('Erro no login', error);
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@refresh');
    await AsyncStorage.removeItem('@user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
