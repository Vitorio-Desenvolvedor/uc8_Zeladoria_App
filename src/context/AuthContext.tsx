import React, { createContext, useState, useContext, ReactNode } from "react";
import api from "../api/api";
import { realizarLogin } from "../services/servicoAutenticacao";
import { salvarToken, removerToken } from "../services/servicoArmazenamento";

// Tipos
export interface UserProfile {
  profile_picture?: string | null;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  nome?: string | null;
  avatar?: string | null;
  profile?: UserProfile | null;
}

export interface AuthContextType {
  user: UserData | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função de login
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await realizarLogin({ username, password });
      const token = response.token;
      await salvarToken(token);

      const userRaw = response.user;

      const parsedUser: UserData = {
        ...userRaw,
        avatar: userRaw.profile?.profile_picture || null,
      };

      setUser(parsedUser);
      setToken(token);
    } catch (err: any) {
      console.error("Erro no login:", err.response?.data || err.message);
      setError("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setUser(null);
    setToken(null);
    setError(null);
    await removerToken();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return context;
}
