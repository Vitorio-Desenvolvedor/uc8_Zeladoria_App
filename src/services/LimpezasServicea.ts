import api from "../api/api";

/** Inicia limpeza (POST /salas/{qr}/iniciar_limpeza/) - retorna registro criado */
export async function iniciarLimpeza(qrOrId: string | number) {
  const res = await api.post(`/salas/${qrOrId}/iniciar_limpeza/`);
  return res.data; // estrutura definida pela API (id do registro)
}

/** Faz upload da foto de comprovação (POST /fotos_limpeza/) -> multipart */
export async function uploadFotoLimpeza(registroId: number, arquivo: { uri: string; name: string; type: string }) {
  const form = new FormData();
  form.append("registro_limpeza", String(registroId));
  form.append("imagem", { uri: arquivo.uri, name: arquivo.name, type: arquivo.type } as any);
  const res = await api.post("/fotos_limpeza/", form);
  return res.data;
}

/** Concluir limpeza (POST /salas/{qr}/concluir_limpeza/) - requer pelo menos uma foto */
export async function concluirLimpeza(qrOrId: string | number, observacoes?: string) {
  const res = await api.post(`/salas/${qrOrId}/concluir_limpeza/`, { observacoes });
  return res.data;
}
