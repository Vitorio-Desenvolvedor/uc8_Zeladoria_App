import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { getHistorico, Historico } from "../api/historico";

export default function TelaHistorico() {
  const { token } = useAuth();
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistorico = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getHistorico(token);
      setHistorico(data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Limpezas</Text>

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardSala}>Sala: {item.sala.nome}</Text>
              <Text>Responsável: {item.usuario.username}</Text>
              <Text>Data: {item.data_limpeza}</Text>
              <Text>Status: {item.status}</Text>
              {item.observacao ? <Text>Obs: {item.observacao}</Text> : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  cardSala: { fontSize: 16, fontWeight: "bold" },
});
