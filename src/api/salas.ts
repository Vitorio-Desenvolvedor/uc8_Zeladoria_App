import api from "./api";
import { Sala as SalaApi } from "./apiTypes";

// Tipagem da Sala
export interface SalaCredenciais {
  id: number;
  nome: string;
  descricao: string;
}

// Listar salas
export const getSalas = async () => {
  const response = await api.get<SalaApi[]>("/salas/");
  console.log (response)
  return response.data;
};


// Criar sala
export const createSala = async (token: string, data: Partial<SalaCredenciais>) => {
  const response = await api.post<SalaCredenciais>("/salas/", data);
  return response.data;
};

// Atualizar sala
export const updateSala = async (token: string, id: number, data: Partial<SalaCredenciais>) => {
  const response = await api.put<SalaCredenciais>(`/salas/${id}/`, data);
  return response.data;
};

// Excluir sala
export const deleteSala = async (token: string, id: number) => {
  await api.delete(`/salas/${id}/`);
};
