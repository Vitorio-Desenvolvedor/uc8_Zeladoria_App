import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../routes/types";
import api from "../api/api";
import { Sala } from "../api/apiTypes";
import { useAuth } from "../context/AuthContext";

type SalaDetalhesRouteProp = RouteProp<RootStackParamList, "SalaDetalhes">;

export default function SalaDetalhesScreen() {
  const route = useRoute<SalaDetalhesRouteProp>();
  const { salaId } = route.params;
  const { token } = useAuth();

  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSala = async () => {
    try {
      setLoading(true);
      const response = await api.get<Sala>(`/salas/${salaId}/`, {
        headers: {
          Authorization: token ? `Token ${token}` : "",
        },
      });
      setSala(response.data);
    } catch (error: any) {
      console.error("Erro ao carregar detalhes da sala:", error.message);
      Alert.alert("Erro", "Não foi possível carregar os detalhes da sala.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSala();
  }, [salaId, token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004A8D" />
        <Text>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!sala) {
    return (
      <View style={styles.center}>
        <Text>Não foi possível carregar a sala.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{sala.nome_numero}</Text>
      <Text style={styles.label}>Descrição:</Text>
      <Text style={styles.value}>{sala.descricao || "Não informada"}</Text>
      <Text style={styles.label}>Status:</Text>
      <Text
        style={[
          styles.value,
          { color: sala.status_limpeza === "Limpa" ? "green" : "red" },
        ]}
      >
        {sala.status_limpeza}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F4F6F9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, color: "#004A8D" },
  label: { fontWeight: "600", marginTop: 8 },
  value: { marginTop: 4, fontSize: 16 },
});
