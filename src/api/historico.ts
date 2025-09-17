import api from "./api";

export interface Historico {
  id: number;
  sala: {
    id: number;
    nome: string;
  };
  usuario: {
    id: number;
    username: string;
  };
  observacao: string;
  data_limpeza: string;
  status: string;
}

// Buscar histórico completo (admin)
export const getHistorico = async (token: string) => {
  const response = await api.get<Historico[]>("/historico/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// Buscar histórico por sala
export const getHistoricoPorSala = async (token: string, salaId: number) => {
  const response = await api.get<Historico[]>(`/Salas/${salaId}/historico/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};
