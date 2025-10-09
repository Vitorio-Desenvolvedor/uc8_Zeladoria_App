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
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList, Sala } from "../routes/types";
import SalaAPI from "../api/salasApi"; // usa os métodos getAllSalas/getSalaById...
import { Ionicons } from "@expo/vector-icons";

type SalasNavigationProp = NavigationProp<RootStackParamList, "Salas">;

export default function SalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<SalasNavigationProp>();

  // Função para buscar todas as salas na API
  const fetchSalas = async () => {
    setLoading(true);
    try {
      const data = await SalaAPI.getAllSalas();
      setSalas(data);
    } catch (error: any) {
      console.error("Erro ao carregar salas:", error.message || error);
      Alert.alert("Erro", "Não foi possível carregar as salas.");
    } finally {
      setLoading(false);
    }
  };

  // Carregar salas ao montar o componente
  useEffect(() => {
    fetchSalas();
  }, []);

  // Navega para a tela de criação de nova sala
  const criarSala = () => {
    navigation.navigate("FormSala", { onSalaCriada: fetchSalas } as any);
  };

  // Abre os detalhes de uma sala específica
  const abrirDetalhes = (s: Sala) => {
    const salaId = s.qr_code_id ?? s.id; // usa o QR code se disponível
    navigation.navigate("SalaDetalhes", { salaId } as any);
  };

  // Retorna uma cor de texto com base no status da limpeza
  const getStatusColor = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("suja")) return "#e53935";
    if (s.includes("em limpeza")) return "#fb8c00";
    if (s.includes("pendente")) return "#757575";
    if (s.includes("limpa")) return "#43a047";
    return "#000";
  };

  // Renderiza cada item da lista (uma sala)
  const renderSala = ({ item }: { item: Sala }) => (
    <TouchableOpacity style={styles.card} onPress={() => abrirDetalhes(item)}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{item.nome_numero}</Text>
          <Text style={styles.descricao}>{item.descricao || "Sem descrição"}</Text>
          <Text style={styles.label}>Capacidade: {item.capacidade ?? "N/A"}</Text>
        </View>

        <View style={{ alignItems: "flex-end", marginLeft: 10 }}>
          <Ionicons name="chevron-forward" size={24} color="#999" />
          <Text
            style={[
              styles.status,
              { color: getStatusColor(item.status_limpeza) },
            ]}
          >
            {item.status_limpeza ?? "Desconhecido"}
          </Text>
        </View>
      </View>
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
      {/* Botão para criar nova sala */}
      <TouchableOpacity style={styles.createButton} onPress={criarSala}>
        <Text style={styles.createButtonText}>+ Criar Nova Sala</Text>
      </TouchableOpacity>

      {/* Lista ou mensagem quando vazia */}
      {salas.length === 0 ? (
        <View style={styles.center}>
          <Text>Nenhuma sala encontrada.</Text>
        </View>
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => String(item.qr_code_id ?? item.id)}
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
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
  },
});
