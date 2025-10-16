import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList, Sala } from "../routes/types";
import SalaAPI from "../api/salasApi";
import { useAuth } from "../context/AuthContext";

type AdminNavigationProp = NavigationProp<RootStackParamList, "Admin">;

export default function TelaAdmin() {
  const navigation = useNavigation<AdminNavigationProp>();
  const { token } = useAuth();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Buscar todas as salas
  const fetchSalas = async () => {
    setLoading(true);
    try {
      const data = await SalaAPI.getAllSalas();
      setSalas(data);
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

  // Atualizar lista via pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSalas();
    setRefreshing(false);
  };

  // Navegar para edição de sala
  const handleEditSala = (s: Sala) => {
    const salaId = s.qr_code_id ?? s.id;
    navigation.navigate("FormEditSala", { salaId } as any);
  };

  // Excluir sala
  const handleDeleteSala = (s: Sala) => {
    const idForDelete = s.qr_code_id ?? s.id;
    Alert.alert("Excluir Sala", "Tem certeza que deseja excluir esta sala?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await SalaAPI.deleteSala(idForDelete);
            Alert.alert("Sucesso", "Sala excluída com sucesso!");
            fetchSalas();
          } catch (error) {
            console.error("Erro ao excluir sala:", error);
            Alert.alert("Erro", "Não foi possível excluir a sala.");
          }
        },
      },
    ]);
  };

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
        onPress={() =>
          navigation.navigate(
            "FormSala",
            { onSalaCriada: fetchSalas } as any
          )
        }
      >
        <Text style={styles.novaSalaText}> Cadastrar Nova Sala</Text>
      </TouchableOpacity>

      <FlatList
        data={salas}
        keyExtractor={(item) => String(item.qr_code_id ?? item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.nome_numero}</Text>
              <Text style={styles.descricao}>
                {item.descricao || "Sem descrição"}
              </Text>
              <Text style={styles.status}>Status: {item.status_limpeza}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#004A8D" }]}
                onPress={() => handleEditSala(item)}
              >
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#E53935" }]}
                onPress={() => handleDeleteSala(item)}
              >
                <Text style={styles.actionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F6F9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  novaSalaText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
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
