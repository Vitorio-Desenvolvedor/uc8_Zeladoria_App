export type User = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
};

export type Sala = {
  id: number;
  nome: string;
};

export type Limpeza = {
  id: number;
  sala: number;
  sala_nome?: string;
  observacao: string;
  data: string;        // ISO string
  usuario: number;
  usuario_username?: string;
   status: string;
};
