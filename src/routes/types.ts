// src/routes/types.ts
export interface CredenciaisLogin {
  username: string;
  password: string;
}

export interface RespostaLoginAPI {
  token: string;
  user: UserData;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser?: boolean;
}

export interface Usuario {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  avatar?: string | null;
}

export type SalaAPI = {
  id?: number; 
  qr_code_id?: number | string;
  nome_numero: string;
  descricao?: string | null;
  capacidade?: number | null;
  localizacao?: string | null;
  status_limpeza: "Limpa" | "Suja" | "Em Limpeza" | "Limpeza Pendente";
  ultima_limpeza_data_hora?: string | null;
  ultima_limpeza_funcionario?: string | null;
  imagem?: string | null;
};

export interface Sala {
  qr_code_id: string | number;
  id: number;
  nome_numero: string;
  descricao?: string;
  capacidade?: number;
  localizacao?: string;
  validade_limpeza_horas?: number | null;
  ativa?: boolean;
  responsaveis?: string[];
  status_limpeza: "Limpa" | "Suja" | "Em Limpeza" | "Limpeza Pendente";
  ultima_limpeza_data_hora?: string | null;
  ultima_limpeza_funcionario?: string | null;
  imagem?: string | null;
}

export interface UserData extends User {
  is_superuser: boolean; // novo
}

export interface Limpeza {
  id: number;
  sala: Sala;
  observacao: string;
  data: string;
}

export interface RegistroLimpeza {
  id: number;
  sala: Sala | number;
  usuario: User | number;
  observacao?: string | null;
  data_hora: string;
}

export interface AuthContextType {
  user: UserData | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Salas: undefined;

  SalaDetalhes: { salaId: string | number };

  TelaPerfil: undefined;

  Admin: undefined;
  Historico: undefined;
  CadastroUsuario: undefined;
  AdminScreen: undefined;

  // Formulários / CRUD de salas
  FormSala: undefined; // tela de listagem/administrativa
  // opcional callback
  FormEditSala: { salaId: string | number };
  FormSalaCreate: { onCreate?: () => void} | undefined;

  // histórico / limpeza
  HistoricoLimpezas: undefined;
  RegistroLimpeza: undefined;
  RegistrarLimpeza: undefined;
};
