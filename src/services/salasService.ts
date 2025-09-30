import api from "../api/api";
import { SalaAPI, Sala } from "../routes/types";
import { mapSalaApiToSala } from "../utils/mapSalaApiToSala";

/** Lista todas as salas (GET /salas/) */
export async function getSalas(): Promise<Sala[]> {
  const res = await api.get<SalaAPI[]>("/salas/");
  return res.data.map(mapSalaApiToSala);
}

/** Busca uma sala específica (GET /salas/{qr_code_id}/) */
export async function getSala(qrOrId: string | number): Promise<Sala> {
  const res = await api.get<SalaAPI>(`/salas/${qrOrId}/`);
  return mapSalaApiToSala(res.data);
}

/**
 * Cria uma sala (POST /salas/)
 * Se imagem for fornecida, enviar multipart/form-data
 * data: { nome_numero, capacidade?, localizacao?, descricao?, imagem? }
 */
export async function createSala(data: {
  nome_numero: string;
  capacidade?: number;
  localizacao?: string;
  descricao?: string;
  imagem?: { uri: string; name: string; type: string } | null;
}): Promise<Sala> {
  const form = new FormData();
  form.append("nome_numero", data.nome_numero);
  if (typeof data.capacidade !== "undefined") form.append("capacidade", String(data.capacidade));
  if (data.localizacao) form.append("localizacao", data.localizacao);
  if (typeof data.descricao !== "undefined") form.append("descricao", data.descricao ?? "");
  if (data.imagem) {
    form.append("imagem", {
      uri: data.imagem.uri,
      name: data.imagem.name,
      type: data.imagem.type,
    } as any);
  }
  const res = await api.post<SalaAPI>("/salas/", form);
  return mapSalaApiToSala(res.data);
}

/**
 * Atualiza sala (PATCH /salas/{qr_code_id}/)
 * payload pode ser FormData (para imagem) ou objeto JSON parcial.
 */
export async function updateSala(
  qrOrId: string | number,
  payload: FormData | { [k: string]: any }
): Promise<Sala> {
  if (payload instanceof FormData) {
    const res = await api.patch<SalaAPI>(`/salas/${qrOrId}/`, payload);
    return mapSalaApiToSala(res.data);
  } else {
    const res = await api.patch<SalaAPI>(`/salas/${qrOrId}/`, payload);
    return mapSalaApiToSala(res.data);
  }
}

/** Exclui sala (DELETE /salas/{qr_code_id}/) */
export async function deleteSala(qrOrId: string | number): Promise<void> {
  await api.delete(`/salas/${qrOrId}/`);
}
