import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  username: string;
  is_staff: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    verificarLogin();
  }, []);

  const verificarLogin = async () => {
    try {
      const tokenSalvo = await AsyncStorage.getItem('token');
      const userSalvo = await AsyncStorage.getItem('user');

      if (tokenSalvo && userSalvo) {
        setToken(tokenSalvo);
        setUser(JSON.parse(userSalvo));
      }
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/login/', {
        username,
        password,
      });

      const tokenRecebido = response.data.auth_token;

      const userResponse = await axios.get('http://127.0.0.1:8000/api/usuario-logado/', {
        headers: { Authorization: `Token ${tokenRecebido}` },
      });

      const userData = userResponse.data;

      setToken(tokenRecebido);
      setUser(userData);

      await AsyncStorage.setItem('token', tokenRecebido);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
