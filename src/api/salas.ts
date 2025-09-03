import api from "./api";

// Tipagem da Sala
export interface Sala {
  id: number;
  nome: string;
  descricao: string;
}

// Listar salas
export const getSalas = async (token: string) => {
  const response = await api.get<Sala[]>("/salas/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// Criar sala
export const createSala = async (token: string, data: Partial<Sala>) => {
  const response = await api.post<Sala>("/salas/", data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// Atualizar sala
export const updateSala = async (token: string, id: number, data: Partial<Sala>) => {
  const response = await api.put<Sala>(`/salas/${id}/`, data, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// Excluir sala
export const deleteSala = async (token: string, id: number) => {
  await api.delete(`/salas/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
};
