import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../routes/types";
import { Sala } from "../api/apiTypes";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

type AdminNavigationProp = NavigationProp<RootStackParamList, "AdminSalas">;

export default function TelaAdminSalas() {
  const navigation = useNavigation<AdminNavigationProp>();
  const { token } = useAuth();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /** 🔄 Buscar Salas */
  const fetchSalas = async () => {
    try {
      setLoading(true);
      const response = await api.get("/salas/", {
        headers: { Authorization: `Token ${token}` },
      });
      setSalas(response.data);
    } catch (error) {
      console.error("Erro ao carregar salas:", error);
      Alert.alert("Erro", "Não foi possível carregar as salas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSalas();
    setRefreshing(false);
  };

  /** ✏️ Editar Sala */
  const handleEditSala = (sala: Sala) => {
    // Navega para o FormSala passando o ID para edição
    navigation.navigate("FormSala", { salaId: sala.id });
  };

  /** ❌ Excluir Sala */
  const handleDeleteSala = (id: number) => {
    Alert.alert(
      "Excluir Sala",
      "Tem certeza que deseja excluir esta sala?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/salas/${id}/`, {
                headers: { Authorization: `Token ${token}` },
              });
              Alert.alert("Sucesso", "Sala excluída com sucesso!");
              fetchSalas(); // Recarregar lista
            } catch (error) {
              console.error("Erro ao excluir sala:", error);
              Alert.alert("Erro", "Não foi possível excluir a sala.");
            }
          },
        },
      ]
    );
  };

  /** 🖼️ Render Item */
  const renderSala = ({ item }: { item: Sala }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome_numero}</Text>
        <Text style={styles.descricao}>{item.descricao || "Sem descrição"}</Text>
        <Text style={styles.status}>
          Status:{" "}
          <Text
            style={{
              color: item.status_limpeza === "Limpa" ? "green" : "red",
            }}
          >
            {item.status_limpeza}
          </Text>
        </Text>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#004A8D" }]}
          onPress={() => handleEditSala(item)}
        >
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#E53935" }]}
          onPress={() => handleDeleteSala(item.id)}
        >
          <Text style={styles.actionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004A8D" />
        <Text style={{ marginTop: 8 }}>Carregando salas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Salas</Text>

      <TouchableOpacity
        style={styles.novaSala}
        onPress={() => navigation.navigate("FormSala")}
      >
        <Text style={styles.novaSalaText}>➕ Cadastrar Nova Sala</Text>
      </TouchableOpacity>

      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSala}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F4F6F9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004A8D",
    marginBottom: 10,
    textAlign: "center",
  },
  novaSala: {
    backgroundColor: "#004A8D",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  novaSalaText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  nome: { fontSize: 18, fontWeight: "bold", color: "#004A8D" },
  descricao: { fontSize: 14, color: "#555", marginVertical: 2 },
  status: { fontSize: 14, fontWeight: "bold" },
  actions: { flexDirection: "row" },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionText: { color: "#fff", fontWeight: "bold" },
});
