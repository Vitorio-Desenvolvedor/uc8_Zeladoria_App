export interface Notificacao {
  id: number;
  mensagem: string;
  link: string;
  data_criacao: string;
  lida: boolean;
}

export interface CredenciaisLogin {
  username: string;
  password: string;
}

export interface RespostaLoginAPI {
  token: string;
  user: UserData;
}

// Usuários
export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser?: boolean;
}

export interface UserData extends User {
  avatar?: string | null;
  is_superuser: boolean; // reforço para autenticação
}

export interface ResponsavelLimpeza {
  id: number;
  username: string;
  nome?: string | null;
  email?: string | null;
}

// Modelo de Sala
export interface Sala {
  id: number;
  qr_code_id: string | number;
  nome_numero: string;
  descricao?: string | null;
  capacidade?: number | null;
  localizacao?: string | null;
  validade_limpeza_horas?: number | null;
  ativa?: boolean;
  responsaveis?: string[];
  status_limpeza: "Limpa" | "Suja" | "Em Limpeza" | "Limpeza Pendente";
  ultima_limpeza_data_hora?: string | null;
  ultima_limpeza_funcionario?: string | null;
  imagem?: string | null;
  responsavel_limpeza?: ResponsavelLimpeza | null;
}

// Histórico de Limpeza
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

// Contexto de autenticação
export interface AuthContextType {
  user: UserData | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Navegação
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Salas: undefined;
  Notificacao: undefined;

  SalaDetalhes: { salaId: string | number };

  TelaPerfil: undefined;

  Admin: undefined;
  Historico: undefined;
  CadastroUsuario: undefined;
  AdminScreen: undefined;

  // CRUD de salas
  FormSala: { onSalaCriada?: () => void } | undefined;
  FormEditSala: { salaId: string | number };
  FormSalaCreate: { onCreate?: () => void } | undefined;

  // histórico / limpeza
  HistoricoLimpezas: undefined;
  RegistroLimpeza: { salaId: string | number };
  IniciarLimpeza: { salaId: string | number; onSuccess?: () => void };
  ConcluirLimpeza: { salaId: string | number; onSuccess?: () => void };
};
