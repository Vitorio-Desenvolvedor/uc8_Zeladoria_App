import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import api from "../api/api";

type Historico = {
  id: number;
  sala: { nome_numero: string };
  data: string;
  status: string;
  observacao?: string;
};

export default function HistoricoLimpezasScreen() {
  const [historico, setHistorico] = useState<Historico[]>([]);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        //  Corrigido endpoint (removido /api extra)
        const res = await api.get("/historico/");
        setHistorico(res.data);
      } catch (error) {
        console.log("Erro ao buscar histórico:", error);
      }
    };
    fetchHistorico();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Limpezas</Text>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Sala: {item.sala.nome_numero}</Text>
            <Text>Data: {item.data}</Text>
            <Text>Status: {item.status}</Text>
            {item.observacao && <Text>Obs: {item.observacao}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F4F6F9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#333" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
