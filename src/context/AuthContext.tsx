import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AuthContextType, UserData } from '../routes/types';

// Criando o contexto, iniciando como null
export const AuthContext = createContext<AuthContextType | null>(null); 

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // 🔹 adicionamos loading

  // Função de login
  const login = async (username: string, password: string) => {
    setLoading(true); // 🔹 inicia loading
    try {
      // 🔹 chamada real à API aqui
      console.log('Login simulado:', username, password);
      setUser({ id: 1, username, email: `${username}@teste.com`, is_staff: false, is_superuser: false });
      setToken('fake-token-123');
    } catch (error) {
      console.error('Erro ao logar:', error);
    } finally {
      setLoading(false); // 🔹 finaliza loading
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acessar o contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
