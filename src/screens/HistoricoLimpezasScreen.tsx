import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import API from "../../api/api";

type Historico = {
  id: number;
  sala: { nome: string };
  data: string;
  status: string;
  observacao?: string;
};

export default function HistoricoLimpezasScreen() {
  const [historico, setHistorico] = useState<Historico[]>([]);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const res = await API.get("/api/historico/");
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
            <Text>Sala: {item.sala.nome}</Text>
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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  card: { padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5 },
});
