import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, BASE_URL } from "../api/api";

type User = {
  id: number;
  username: string;
  email?: string;
  is_staff: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // carrega token salvo e tenta obter /auth/users/me/
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("token");
        if (saved) {
          setToken(saved);
          await fetchMe(); // se token válido, preenche user
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchMe = async () => {
    const { data } = await api.get<User>("/auth/users/me/");
    setUser(data);
  };

  const signIn = async (username: string, password: string) => {
    // Djoser: /auth/token/login/ -> {auth_token}
    const loginRes = await api.post<{ auth_token: string }>(
      "/auth/token/login/",
      { username, password }
    );
    const authToken = loginRes.data.auth_token;
    await AsyncStorage.setItem("token", authToken);
    setToken(authToken);

    // carrega usuário atual
    await fetchMe();
  };

  const signOut = async () => {
    try {
      // Djoser: /auth/token/logout/
      await api.post("/auth/token/logout/");
    } catch {}
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
  };

  const refreshMe = async () => {
    const saved = await AsyncStorage.getItem("token");
    if (saved) {
      setToken(saved);
      await fetchMe();
    }
  };

  const value = useMemo(
    () => ({ user, token, loading, signIn, signOut, refreshMe }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
