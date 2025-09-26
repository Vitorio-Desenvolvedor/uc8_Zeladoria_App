import { Sala } from "../routes/types";
import api from "../api/api"; // sua instância axios

// tipo cru que a API retorna
export type SalaAPI = {
  qr_code_id: number | string;
  nome_numero: string;
  descricao?: string | null;
  capacidade?: number | null;
  localizacao?: string | null;
  status_limpeza: "Limpa" | "Suja" | "Em Limpeza" | "Limpeza Pendente";
  ultima_limpeza_data_hora?: string | null;
  ultima_limpeza_funcionario?: string | null;
  imagem?: string | null;
};

// mapear API -> app
export function mapSalaApiToSala(a: SalaAPI): Sala {
  return {
    id: a.qr_code_id,
    nome_numero: a.nome_numero,
    descricao: a.descricao ?? "",
    status_limpeza: a.status_limpeza as Sala["status_limpeza"],
    capacidade: a.capacidade ?? undefined,
    localizacao: a.localizacao ?? undefined,
    ultima_limpeza_data_hora: a.ultima_limpeza_data_hora ?? null,
    ultima_limpeza_funcionario: a.ultima_limpeza_funcionario ?? null,
    imagem: a.imagem ?? null,
  };
}

export function mapSalasApiToSalas(arr: SalaAPI[]): Sala[] {
  return arr.map(mapSalaApiToSala);
}

/** ---- chamadas API seguras ---- */

export async function fetchSalas() {
  const res = await api.get("/salas/");
  return mapSalasApiToSalas(res.data as SalaAPI[]);
}

export async function fetchSala(id: number | string) {
  const res = await api.get(`/salas/${id}/`);
  return mapSalaApiToSala(res.data as SalaAPI);
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
) {
  const formData = new FormData();
  formData.append("nome_numero", data.nome_numero);

  if (typeof data.capacidade !== "undefined") {
    formData.append("capacidade", String(data.capacidade));
  }
  if (data.localizacao) {
    formData.append("localizacao", data.localizacao);
  }
  if (typeof data.descricao !== "undefined") {
    formData.append("descricao", String(data.descricao));
  }
  if (data.imagem) {
    formData.append("imagem", {
      uri: data.imagem.uri,
      name: data.imagem.name,
      type: data.imagem.type,
    } as any);
  }

  const headers: any = {};
  if (token) headers.Authorization = `Token ${token}`;

  const res = await api.post("/salas/", formData, { headers });
  return mapSalaApiToSala(res.data as SalaAPI);
}

export async function updateSala(
  id: number | string,
  payload: FormData | { [k: string]: any },
  token?: string
) {
  const headers: any = {};
  if (token) headers.Authorization = `Token ${token}`;

  // se for FormData, passe diretamente; se for objeto, envie JSON
  if (payload instanceof FormData) {
    const res = await api.patch(`/salas/${id}/`, payload, { headers });
    return mapSalaApiToSala(res.data as SalaAPI);
  } else {
    const res = await api.patch(`/salas/${id}/`, payload, { headers });
    return mapSalaApiToSala(res.data as SalaAPI);
  }
}

export async function deleteSala(id: number | string, token?: string) {
  const headers: any = {};
  if (token) headers.Authorization = `Token ${token}`;
  await api.delete(`/salas/${id}/`, { headers });
}
