import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface Limpeza {
  id: number;
  sala: string;
  observacao: string;
  data_limpeza: string;
}

export default function HistoricoLimpezasScreen() {
  const [historico, setHistorico] = useState<Limpeza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get("http://192.168.15.3:8000/api/limpezas/", {
          headers: { Authorization: `Token ${token}` },
        });
        setHistorico(response.data);
      } catch (error) {
        console.error("Erro ao buscar histórico de limpezas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico de Limpezas</Text>
      {historico.length === 0 ? (
        <Text style={styles.semDados}>Nenhum registro encontrado.</Text>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.sala}>Sala: {item.sala}</Text>
              <Text>Data: {new Date(item.data_limpeza).toLocaleString()}</Text>
              <Text>Observação: {item.observacao || "Sem observação"}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  semDados: { textAlign: "center", marginTop: 20, fontSize: 16 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sala: { fontSize: 16, fontWeight: "bold" },
});
