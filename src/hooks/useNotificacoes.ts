// src/hooks/useNotificacoes.ts
import { useState, useEffect, useCallback } from "react";
import NotificacaoAPI from "../api/notificacoesApi";
import { Notificacao } from "../routes/types";

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar notificações
  const carregarNotificacoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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

  // Carregar notificações ao montar o hook
  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  return {
    notificacoes,
    loading,
    error,
    carregarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
  };
}
