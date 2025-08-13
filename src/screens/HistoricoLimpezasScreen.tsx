import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface HistoricoItem {
  id: number;
  sala: string;
  observacao: string;
  data_limpeza: string;
}

export default function HistoricoLimpezasScreen() {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado");
          return;
        }

        const response = await axios.get("http://192.168.15.3:8000/api/historico/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setHistorico(response.data);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando histórico...</Text>
      </View>
    );
  }

  if (historico.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhum registro encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.sala}</Text>
            <Text>Observação: {item.observacao || "Nenhuma"}</Text>
            <Text>Data: {new Date(item.data_limpeza).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, textAlign: "center", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
});
