import api from "./api";
import { SalaAPI, mapSalaApiToSala } from "../services/salasApi";
import { Sala } from "../routes/types";

// Listar salas (GET)
export const getSalas = async (token: string): Promise<Sala[]> => {
  const response = await api.get<SalaAPI[]>("/Salas/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data.map(mapSalaApiToSala);
};

// Criar sala (POST)
export const createSala = async (token: string, data: Partial<SalaAPI>): Promise<Sala> => {
  const response = await api.post<SalaAPI>("/Salas/", data, {
    headers: { Authorization: `Token ${token}` },
  });
  return mapSalaApiToSala(response.data);
};

// Atualizar sala (PUT)
export const updateSala = async (token: string, id: number, data: Partial<SalaAPI>): Promise<Sala> => {
  const response = await api.put<SalaAPI>(`/Salas/${id}/`, data, {
    headers: { Authorization: `Token ${token}` },
  });
  return mapSalaApiToSala(response.data);
};

// Excluir sala (DELETE)
export const deleteSala = async (token: string, id: number) => {
  await api.delete(`/Salas/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
};
