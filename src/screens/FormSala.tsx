// src/screens/FormSala.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Sala } from "../routes/types";
import { fetchSalas } from "../services/salasApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "FormSala">;

export default function FormSala() {
  const { token, user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const [salas, setSalas] = useState<Sala[]>([]);
  const [blocosDisponiveis, setBlocosDisponiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSalas();
      setSalas(data);

      // Extrai "bloco" da localizacao (ex.: "Bloco C, Sala 203") — ajuste se sua API já tiver campo bloco
      const blocos = Array.from(
        new Set(
          data.map((s) => {
            const loc = s.localizacao ?? "Sem Localização";
            return loc.split(",")[0].trim();
          })
        )
      );
      setBlocosDisponiveis(blocos);
    } catch (err) {
      console.error("Erro ao carregar salas:", err);
      Alert.alert("Erro", "Não foi possível carregar as salas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  };

  const salasFiltradas = salas; // Você pode filtrar por blocoSelecionado, se mantiver esse estado

  const criarSala = () => {
    // Navega para a tela de criação (callback opcional)
    navigation.navigate("FormSalaCreate", { onCreate: carregar });
  };

  const editarSala = (sala: Sala) => {
    // navega usando qr_code_id (se existir) ou id
    const salaId = sala.qr_code_id ?? sala.id;
    navigation.navigate("FormEditSala", { salaId });
  };

  const excluirSala = (sala: Sala) => {
    Alert.alert("Excluir Sala", `Deseja excluir "${sala.nome_numero}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`https://zeladoria.tsr.net.br/api/salas/${sala.qr_code_id ?? sala.id}/`, {
              method: "DELETE",
              headers: { Authorization: `Token ${token}` },
            });
            Alert.alert("Sucesso", "Sala excluída");
            carregar();
          } catch (err) {
            console.error("Erro ao excluir:", err);
            Alert.alert("Erro", "Não foi possível excluir a sala.");
          }
        },
      },
    ]);
  };

  const renderSala = ({ item }: { item: Sala }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        Alert.alert("Ações", `Escolha ação para ${item.nome_numero}`, [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Detalhes",
            onPress: () =>
              navigation.navigate("SalaDetalhes", { salaId: item.qr_code_id ?? item.id }),
          },
          { text: "Editar", onPress: () => editarSala(item) },
          { text: "Excluir", onPress: () => excluirSala(item), style: "destructive" },
        ])
      }
    >
      <Text style={styles.titulo}>{item.nome_numero}</Text>
      <Text>Localização: {item.localizacao ?? "N/A"}</Text>
      <Text>Capacidade: {item.capacidade ?? "N/A"}</Text>
      <Text>Descrição: {item.descricao ?? "—"}</Text>
      <Text style={{ marginTop: 6, fontWeight: "700", color: statusColor(item.status_limpeza) }}>
        {item.status_limpeza}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004A8D" />
        <Text>Carregando salas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user?.is_staff && (
        <TouchableOpacity style={styles.createButton} onPress={criarSala}>
          <Text style={styles.createButtonText}>+ Criar Nova Sala</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={salasFiltradas}
        keyExtractor={(item) => String(item.qr_code_id ?? item.id)}
        renderItem={renderSala}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

function statusColor(status: string) {
  const s = status.toLowerCase();
  if (s.includes("suja")) return "#E53935"; // vermelho
  if (s.includes("em limpeza")) return "#FB8C00"; // laranja
  if (s.includes("pendente")) return "#757575"; // cinza 
  if (s.includes("limpa")) return "#43A047"; //verde
  return "#000";
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F4F6F9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  createButton: { backgroundColor: "#004A8D", padding: 12, borderRadius: 8, marginBottom: 15, alignItems: "center" },
  createButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 12, elevation: 3 },
  titulo: { fontSize: 18, fontWeight: "bold", color: "#004A8D" },
});
