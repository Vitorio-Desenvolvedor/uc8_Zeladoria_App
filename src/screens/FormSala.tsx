import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";

type Sala = {
  id: number;
  nome: string;
  capacidade: number;
  recursos: string;
  bloco: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function FormSala() {
  const { token, user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const [salas, setSalas] = useState<Sala[]>([]);
  const [blocoSelecionado, setBlocoSelecionado] = useState<string | null>(null);
  const [blocosDisponiveis, setBlocosDisponiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const buscarSalas = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/salas/", {
        headers: { Authorization: `Token ${token}` },
      });

      const data: Sala[] = response.data;
      setSalas(data);

      const blocosUnicos: string[] = Array.from(new Set(data.map((s) => s.bloco)));
      setBlocosDisponiveis(blocosUnicos);
    } catch (error: any) {
      console.error("Erro ao buscar salas:", error.message);
      Alert.alert("Erro", "Não foi possível carregar as salas.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await buscarSalas();
    setRefreshing(false);
  };

  useEffect(() => {
    buscarSalas();
  }, []);

  const salasFiltradas = blocoSelecionado
    ? salas.filter((s) => s.bloco === blocoSelecionado)
    : salas;

  const renderSala = ({ item }: { item: Sala }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("SalaDetalhes", { salaId: item.id }) // Erro Corrigido : "DetalhesSala", dava erro.
      }
    >
      <Text style={styles.titulo}>{item.nome}</Text>
      <Text>Bloco: {item.bloco}</Text>
      <Text>Capacidade: {item.capacidade}</Text>
      <Text>Recursos: {item.recursos}</Text>
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
      <Text style={styles.header}>Blocos</Text>

      <FlatList
        data={blocosDisponiveis}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.blocosContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.bloco, blocoSelecionado === item && styles.blocoSelecionado]}
            onPress={() =>
              setBlocoSelecionado(item === blocoSelecionado ? null : item)
            }
          >
            <Text
              style={[styles.blocoTexto, blocoSelecionado === item && { color: "#fff" }]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={salasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSala}
        contentContainerStyle={[styles.listaSalas, { paddingBottom: 50 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {user?.is_staff && (
        <View style={styles.adminArea}>
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate("AdminSalas")}
          >
            <Text>⚙️ Gerenciar Salas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate("Historico")} // Erro corrigido: "TelaHistorico" dava erro.
          >
            <Text>Ver Histórico</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F4F6F9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#004A8D" },
  blocosContainer: { marginBottom: 10 },
  bloco: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  blocoSelecionado: { backgroundColor: "#004A8D" },
  blocoTexto: { color: "#000" },
  listaSalas: { paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  titulo: { fontSize: 16, fontWeight: "bold", color: "#004A8D" },
  adminArea: { marginTop: 20, flexDirection: "row", justifyContent: "space-around" },
  adminButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
});
