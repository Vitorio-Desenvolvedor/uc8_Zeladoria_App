import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Limpeza = {
  id: number;
  sala_nome: string;
  usuario_nome: string;
  observacao: string;
  data_limpeza: string;
};

export default function HistoricoLimpezasScreen() {
  const [historico, setHistorico] = useState<Limpeza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get("http://192.168.15.3:8000/limpezas/", {
          headers: { Authorization: `Token ${token}` },
        });
        setHistorico(response.data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o histórico de limpezas.");
      } finally {
        setLoading(false);
      }
    }
    carregarHistorico();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Limpezas</Text>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sala: {item.sala_nome}</Text>
            <Text>Responsável: {item.usuario_nome}</Text>
            <Text>Observação: {item.observacao || "Sem observação"}</Text>
            <Text>Data: {new Date(item.data_limpeza).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: { fontWeight: "bold" },
});
