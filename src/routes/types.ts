export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export interface Usuario {
  id: number,
  username: string
  email: string,
  is_staff: boolean,
  is_superuser:boolean
 }

export interface UserData {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  avatar?: string;
}

export interface Sala {
  id: number | string; //
  qr_code_id?: number | string; // alteração feita
  nome_numero: string;
  descricao: string;
  status_limpeza: "Suja" | "Em Limpeza" | "Limpeza Pendente" | "Limpa";
  capacidade? : number;
  localizacao?: string;
  ultima_limpeza_data_hora?: string | null;
  ultima_limpeza_funcionario?: string | null;
  imagem?: string | null;
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
usuario: Usuario | number;
observacao: string | null;
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
  SalaDetalhes: { salaId: number | string };
  TelaPerfil: undefined;

  // Rotas administrativas
  Admin: undefined;
  Historico: undefined;
  CadastroUsuario: undefined;
  AdminScreen: undefined;
  FormSala: { salaId?: number | string };
  FormEditSala: { salaId: number | string };
  FormSalaCriar: { onCreate: () => Promise <void> };
  HistoricoLimpezas: undefined;
  RegistroLimpeza: undefined;
  RegistrarLimpeza: { salaId: number | string };
};
