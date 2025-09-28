import React, { createContext, useState, useContext, ReactNode } from "react";
import api from "../api/api";
import { AuthContextType, UserData } from "../routes/types";
import { realizarLogin } from "../services/servicoAutenticacao";
import { removerToken, salvarToken } from "../services/servicoArmazenamento";


export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); //  para tratar mensagens de erro

  // 🔹 Função de login real com API
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await realizarLogin({username, password})

      // A API retorna: { token, user_data }
      const { token, user } = response; //ajuste 

      await salvarToken(token)

      setToken(token);
      setUser(user); // ajuste 

      console.log("Login realizado com sucesso:", user); //ajuste 
    } catch (err: any) {
      console.error("Erro no login:", err.response?.data || err.message);
      setError("Usuário ou senha inválidos."); // mensagem de usuário ou senha errados
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Função de logout
  const logout = async () => {
    setUser(null);
    setToken(null);
    setError(null);
    await removerToken()
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, error, }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acessar o contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
