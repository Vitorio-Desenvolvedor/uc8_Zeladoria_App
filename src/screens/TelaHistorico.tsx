import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import api from "../api/api";
import { RegistroLimpeza, Sala, Usuario } from "../routes/types"; // ajuste nescessário 

export default function TelaHistorico() {
  const [historico, setHistorico] = useState<RegistroLimpeza[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistorico = async () => {
    setLoading(true);
    try {
      const response = await api.get<RegistroLimpeza[]>("/limpezas/");
      setHistorico(response.data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      Alert.alert("Erro", "Não foi possível carregar o histórico de limpezas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, []);

  const renderItem = ({ item }: { item: RegistroLimpeza }) => {
    const sala = typeof item.sala === "object" ? (item.sala as Sala).nome_numero : `Sala ${item.sala}`;
    const usuario = typeof item.usuario === "object" ? (item.usuario as Usuario).username : `Usuário ${item.usuario}`;
    const dataFormatada = new Date(item.data_hora).toLocaleString("pt-BR");

    return (
      <View style={styles.card}>
        <Text style={styles.sala}>{sala}</Text>
        <Text>Responsável: {usuario}</Text>
        {item.observacao && <Text>Obs: {item.observacao}</Text>}
        <Text style={styles.data}>{dataFormatada}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {historico.length === 0 ? (
        <Text style={styles.empty}>Nenhum registro de limpeza encontrado.</Text>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  sala: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  data: { fontSize: 12, color: "#555", marginTop: 4 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#777" },
});
