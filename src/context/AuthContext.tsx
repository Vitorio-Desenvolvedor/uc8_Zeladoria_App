import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextProps {
  userToken: string | null;
  userInfo: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const login = async (username: string, password: string) => {
    const res = await axios.post('http://192.168.15.3:8000/auth/token/login/', {
      username,
      password,
    });
    const token = res.data.auth_token;
    setUserToken(token);

    const userRes = await axios.get('http://192.168.15.3:8000/auth/users/me/', {
      headers: { Authorization: `Token ${token}` },
    });
    setUserInfo(userRes.data);
  };

  const logout = () => {
    setUserToken(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
