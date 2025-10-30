import { useState, useEffect, useCallback } from "react";
import NotificacaoAPI from "../api/notificacoesApi";
import { Notificacao } from "../routes/types";

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega todas as notificações da API
  const carregarNotificacoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dados = await NotificacaoAPI.listarNotificacoes();
      setNotificacoes(dados);
    } catch (err: any) {
      console.error("Erro ao carregar notificações:", err);
      setError("Não foi possível carregar as notificações.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar uma notificação como lida
  const marcarComoLida = useCallback(async (id: number) => {
    try {
      await NotificacaoAPI.marcarComoLida(id);
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
      );
    } catch (err: any) {
      console.error("Erro ao marcar como lida:", err);
      setError("Não foi possível marcar a notificação como lida.");
    }
  }, []);

  // Marcar todas como lidas
  const marcarTodasComoLidas = useCallback(async () => {
    try {
      await NotificacaoAPI.marcarTodasComoLidas();
      setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
    } catch (err: any) {
      console.error("Erro ao marcar todas como lidas:", err);
      setError("Não foi possível marcar todas as notificações como lidas.");
    }
  }, []);

  // Atualiza automaticamente a cada X segundos
  useEffect(() => {
    carregarNotificacoes();

    const intervalo = setInterval(() => {
      carregarNotificacoes();
    }, 15000); // 15 segundos

    return () => clearInterval(intervalo);
  }, [carregarNotificacoes]);

  // Exporta também para ser chamado manualmente
  return {
    notificacoes,
    loading,
    error,
    carregarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
    refreshNotificacoes: carregarNotificacoes,
  };
}
