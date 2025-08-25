import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api/api";

type User = {
  id: number;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const stored = await AsyncStorage.getItem("token");
      if (stored) {
        setToken(stored);
        await refreshMe();
      }
    };
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await API.post("/auth/jwt/create/", { username, password });
    const token = res.data.access;
    await AsyncStorage.setItem("token", token);
    setToken(token);
    await refreshMe();
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshMe = async () => {
    if (!token) return;
    try {
      const res = await API.get("/auth/users/me/");
      setUser(res.data);
    } catch (error) {
      console.log("Erro ao buscar usuário:", error);
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
