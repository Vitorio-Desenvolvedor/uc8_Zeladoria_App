export type User = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
};

export interface Sala {
  id: number;
  nome: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface AuthContextType {
  user: UserData | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}


export interface Limpeza {
  id: number;
  sala: Sala; 
  observacao: string;
  data: string;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  RegistroLimpeza: undefined;
  HistoricoLimpezas: undefined;
  AdminSalas: undefined;
  DetalhesSala: { salaId: number };
  TelaHistorico: undefined;
  AdminScreen: undefined;
  CadastroUsuario: undefined;
  TelaPerfil: undefined;
  FormSala: undefined;
  Salas: undefined;
};



