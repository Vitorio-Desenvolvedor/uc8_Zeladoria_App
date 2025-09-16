import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../routes/types";
import api from "../api/api";
import { Sala } from "../api/apiTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Tipagem de rota
type SalaDetalhesRouteProp = RouteProp<RootStackParamList, "SalaDetalhes">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "SalaDetalhes">;

export default function SalaDetalhesScreen() {
  const route = useRoute<SalaDetalhesRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { salaId } = route.params;

  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSalaDetalhes = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/salas/${salaId}/`);
      setSala(response.data);
    } catch (error: any) {
      console.error("Erro ao carregar detalhes da sala:", error.message);
      Alert.alert("Erro", "Não foi possível carregar os detalhes da sala.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaDetalhes();
  }, [salaId]);

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
        <Text style={{ color: "red" }}>Sala não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{sala.nome_numero}</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}> Localização:</Text>
        <Text style={styles.value}>{sala.localizacao}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}> Capacidade:</Text>
        <Text style={styles.value}>{sala.capacidade} pessoas</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}> Descrição:</Text>
        <Text style={styles.value}>{sala.descricao}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}> Status da Limpeza:</Text>
        <Text
          style={[
            styles.value,
            { color: sala.status_limpeza === "Limpa" ? "green" : "red" },
          ]}
        >
          {sala.status_limpeza}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}> Última Limpeza:</Text>
        <Text style={styles.value}>
          {sala.ultima_limpeza_data_hora
            ? sala.ultima_limpeza_data_hora
            : "Nunca registrada"}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}> Funcionário:</Text>
        <Text style={styles.value}>
          {sala.ultima_limpeza_funcionario
            ? sala.ultima_limpeza_funcionario
            : "N/A"}
        </Text>
      </View>

      {/* Botões de ação */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#004A8D" }]}
          onPress={() => navigation.navigate("RegistrarLimpeza", { salaId })}
        >
          <Text style={styles.buttonText}>Registrar Limpeza</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#888" }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#004A8D",
    marginBottom: 20,
    textAlign: "center",
  },
  infoBox: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "600", color: "#333" },
  value: { fontSize: 15, color: "#555", marginTop: 3 },
  actions: {
    marginTop: 30,
    flexDirection: "column",
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
