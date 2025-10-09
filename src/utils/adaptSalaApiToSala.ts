import { Sala, SalaAPI } from "../routes/types";

/**
 * Converte o objeto cru da API (SalaAPI) para o formato do app (Sala).
 * Faz normalizações e guarda fallback para lidar com backend antigo/novo.
 */
export function mapSalaApiToSala(a: SalaAPI): Sala {
  // preferimos qr_code_id se presente (string UUID ou número)
  const primaryId = a.qr_code_id ?? a.id ?? Math.random();
  return {
    id: primaryId,
    qr_code_id: a.qr_code_id ?? a.id,
    nome_numero: a.nome_numero,
    descricao: a.descricao ?? undefined,
    status_limpeza: a.status_limpeza as Sala["status_limpeza"],
    capacidade: a.capacidade ?? undefined,
    localizacao: a.localizacao ?? undefined,
    ultima_limpeza_data_hora: a.ultima_limpeza_data_hora ?? null,
    ultima_limpeza_funcionario: a.ultima_limpeza_funcionario ?? null,
    imagem: a.imagem ?? null,
  };
}
