import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type User = {
  id: number;
  username: string;
  is_staff: boolean;
  // outros campos, se necessário
};

export type AuthContextType = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!token;

  useEffect(() => {
    const carregarDados = async () => {
      const tokenSalvo = await AsyncStorage.getItem('token');
      const userSalvo = await AsyncStorage.getItem('user');

      if (tokenSalvo && userSalvo) {
        setToken(tokenSalvo);
        setUser(JSON.parse(userSalvo));
      }
    };

    carregarDados();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/login/', {
        username,
        password,
      });

      const tokenRecebido = response.data.token;
      setToken(tokenRecebido);
      await AsyncStorage.setItem('token', tokenRecebido);

      // Buscar dados do usuário
      const userResponse = await axios.get('http://127.0.0.1:8000/api/accounts/current_user/', {
        headers: {
          Authorization: `Token ${tokenRecebido}`,
        },
      });

      setUser(userResponse.data);
      await AsyncStorage.setItem('user', JSON.stringify(userResponse.data));
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      throw new Error('Falha no login');
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
