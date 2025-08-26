import React, { createContext, useContext, useMemo, useState } from "react";
import { api, setAuthToken } from "../api/api";

type UserData = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
};

type AuthContextType = {
  user: UserData | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Endpoint real informado por você
      const { data } = await api.post("/accounts/login/", { username, password });
      // A API retorna { username, password, token, user_data: {...} }
      const receivedToken: string = data?.token;
      const userData: UserData = data?.user_data;

      if (!receivedToken || !userData) {
        throw new Error("Resposta de login inesperada.");
      }

      setToken(receivedToken);
      setUser(userData);
      setAuthToken(receivedToken);
      // (Opcional) persistir no AsyncStorage se quiser login persistente
      // await AsyncStorage.setItem("auth", JSON.stringify({ token: receivedToken, user: userData }));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    // AsyncStorage.removeItem("auth").catch(() => {});
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado DENTRO de <AuthProvider>.");
  }
  return ctx;
}
