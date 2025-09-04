import api from "./api";

export interface RegistroLimpeza {
  id: number;
  sala: number;
  usuario: number;
  observacao: string;
  status: string;
  data_limpeza: string;
}

// Registrar limpeza
export const registrarLimpeza = async (
  token: string,
  salaId: number,
  observacao: string,
  status: "limpa" | "pendente" = "limpa"
) => {
  const response = await api.post<RegistroLimpeza>(
    "/historico/",
    {
      sala: salaId,
      observacao,
      status,
    },
    {
      headers: { Authorization: `Token ${token}` },
    }
  );
  return response.data;
};
