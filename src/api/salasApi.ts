import api from "../api/api";
import { Sala } from "../routes/types";

/* Tipo cru que a API retorna (adaptável conforme sua API) */
export type SalaAPI = {
  id: number;
  qr_code_id: string | number;
  nome_numero: string;
  descricao?: string | null;
  capacidade?: number | null;
  localizacao?: string | null;
  status_limpeza: "Limpa" | "Suja" | "Em Limpeza" | "Limpeza Pendente";
  ultima_limpeza_data_hora?: string | null;
  ultima_limpeza_funcionario?: string | null;
  imagem?: string | null;
  validade_limpeza_horas?: number | null;
  ativa?: boolean;
  responsaveis?: string[] | null;
};

/* Mapeia a resposta da API para o tipo usado no App */
export function mapSalaApiToSala(a: SalaAPI): Sala {
  return {
    id: a.id,
    qr_code_id: a.qr_code_id,
    nome_numero: a.nome_numero,
    descricao: a.descricao ?? null,
    status_limpeza: a.status_limpeza as Sala["status_limpeza"],
    capacidade: a.capacidade ?? null,
    localizacao: a.localizacao ?? null,
    ultima_limpeza_data_hora: a.ultima_limpeza_data_hora ?? null,
    ultima_limpeza_funcionario: a.ultima_limpeza_funcionario ?? null,
    imagem: a.imagem ?? null,
    validade_limpeza_horas: a.validade_limpeza_horas ?? null,
    ativa: typeof a.ativa === "boolean" ? a.ativa : undefined,
    responsaveis: a.responsaveis ?? undefined,
  } as Sala;
}

export function mapSalasApiToSalas(arr: SalaAPI[]): Sala[] {
  return arr.map(mapSalaApiToSala);
}

/** Chamadas à API */
export async function fetchSalas(): Promise<Sala[]> {
  const res = await api.get<SalaAPI[]>("/salas/");
  return mapSalasApiToSalas(res.data);
}

export async function fetchSala(id: string | number): Promise<Sala> {
  const res = await api.get<SalaAPI>(`/salas/${id}/`);
  return mapSalaApiToSala(res.data);
}

export async function createSala(
  data: {
    nome_numero: string;
    capacidade?: number;
    localizacao?: string;
    descricao?: string;
    imagem?: { uri: string; name: string; type: string } | null;
  },
  token?: string
): Promise<Sala> {
  const formData = new FormData();
  formData.append("nome_numero", data.nome_numero);
  if (typeof data.capacidade !== "undefined") formData.append("capacidade", String(data.capacidade));
  if (data.localizacao) formData.append("localizacao", data.localizacao);
  if (typeof data.descricao !== "undefined") formData.append("descricao", String(data.descricao));
  if (data.imagem) {
    formData.append("imagem", {
      uri: data.imagem.uri,
      name: data.imagem.name,
      type: data.imagem.type,
    } as any);
  }

  const headers: any = {};
  if (token) headers.Authorization = `Token ${token}`;
  const res = await api.post<SalaAPI>("/salas/", formData, { headers });
  return mapSalaApiToSala(res.data);
}

export async function updateSala(
  id: string | number,
  payload: FormData | { [k: string]: any },
  token?: string
): Promise<Sala> {
  const headers: any = {};
  if (token) headers.Authorization = `Token ${token}`;
  const res = await api.patch<SalaAPI>(`/salas/${id}/`, payload, { headers });
  return mapSalaApiToSala(res.data);
}

export async function deleteSala(id: string | number, token?: string): Promise<void> {
  const headers: any = {};
  if (token) headers.Authorization = `Token ${token}`;
  await api.delete(`/salas/${id}/`, { headers });
}
