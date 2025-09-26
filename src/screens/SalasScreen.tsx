 import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../api/api";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../routes/types";
import { Sala } from "../routes/types";

// Tipagem da navegação
type SalasNavigationProp = NavigationProp<RootStackParamList, "Salas">;

export default function SalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<SalasNavigationProp>();

  // Buscar salas
  const fetchSalas = async () => {
    setLoading(true);
    try {
      const response = await api.get<Sala[]>("/salas/");
      console.log("Salas carregadas:", response.data);
      setSalas(response.data);
    } catch (error: any) {
      console.error("Erro ao carregar salas:", error.message || error);
      Alert.alert("Erro", "Não foi possível carregar as salas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  // Criar nova sala
  const criarSala = () => {
    navigation.navigate("FormSala", { onSalaCriada: fetchSalas }); // tratar Erro
  };

  // 🔹 Função para determinar cor de acordo com o status
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s.includes("suja")) return "#e53935";           // vermelho
    if (s.includes("em limpeza")) return "#fb8c00";     // laranja
    if (s.includes("pendente")) return "#757575";       // cinza
    if (s.includes("limpa")) return "#43a047";          // verde
    return "#000"; // fallback
  };

  // Renderizar cada sala
  const renderSala = ({ item }: { item: Sala }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("SalaDetalhes", { salaId: item.qr_code_id }) // Tratar Erro
      }
    >
      <Text style={styles.nome}>{item.nome_numero}</Text>
      <Text style={styles.descricao}>{item.descricao || "Sem descrição"}</Text>
      <Text style={styles.label}>Capacidade: {item.capacidade}</Text>

      {/* 🔹 Status colorido */}
      <Text style={[styles.status, { color: getStatusColor(item.status_limpeza) }]}>
        {item.status_limpeza || "Status Desconhecido"}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#004A8D" />
        <Text style={{ marginTop: 10 }}>Carregando salas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Botão Criar Sala */}
      <TouchableOpacity style={styles.createButton} onPress={criarSala}>
        <Text style={styles.createButtonText}>+ Criar Nova Sala</Text>
      </TouchableOpacity>

      {salas.length === 0 ? (
        <View style={styles.center}>
          <Text>Nenhuma sala encontrada.</Text>
        </View>
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => item.qr_code_id.toString()} // Tratar Erro
          renderItem={renderSala}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F4F6F9",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#004A8D",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004A8D",
  },
  descricao: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
  },
});
