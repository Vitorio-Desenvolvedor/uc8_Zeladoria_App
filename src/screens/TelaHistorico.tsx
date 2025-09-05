import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

interface Historico {
  id: number;
  sala: number; // vem como ID
  observacao: string;
  data_hora: string;
  usuario: string;
}

export default function TelaHistorico() {
  const { token } = useAuth();
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await api.get("/limpezas/", {
          headers: { Authorization: `Token ${token}` },
        });
        setHistorico(response.data);
      } catch (error) {
        console.error("❌ Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorico();
  }, [token]);

  if (loading) return <ActivityIndicator size="large" color="#000" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Limpezas</Text>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>🧹 Sala ID: {item.sala}</Text>
            <Text style={styles.text}>📋 Observação: {item.observacao}</Text>
            <Text style={styles.text}>👤 Funcionário: {item.usuario}</Text>
            <Text style={styles.text}>📅 Data: {new Date(item.data_hora).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 10 },
  text: { fontSize: 14 },
});
