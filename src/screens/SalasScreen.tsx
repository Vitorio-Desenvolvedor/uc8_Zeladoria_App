import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import api from "../api/api";
import { Sala } from "../api/apiTypes";
import { useNavigation } from "@react-navigation/native";

export default function SalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await api.get<Sala[]>("/salas/"); 
        setSalas(response.data);
      } catch (error) {
        console.error("Erro ao buscar salas:", error);
        Alert.alert("Erro", "Não foi possível carregar as salas. Verifique a API.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalas();
  }, []);

  const renderItem = ({ item }: { item: Sala }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("SalaDetalhes", { sala: item })}
    >
      <Text style={styles.nome}>{item.nome_numero}</Text>
      <Text style={styles.info}>Capacidade: {item.capacidade}</Text>
      <Text style={styles.info}>Localização: {item.localizacao}</Text>
      <Text
        style={[
          styles.status,
          { color: item.status_limpeza === "Limpa" ? "green" : "red" },
        ]}
      >
        {item.status_limpeza}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando salas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {salas.length === 0 ? (
        <Text style={styles.empty}>Nenhuma sala encontrada.</Text>
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 15 },
  list: { paddingBottom: 20 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  nome: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  info: { fontSize: 14, color: "#555" },
  status: { fontSize: 14, fontWeight: "bold", marginTop: 5 },
});
