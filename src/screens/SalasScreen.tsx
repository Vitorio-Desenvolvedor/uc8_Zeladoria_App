import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  RefreshControl,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList, Sala } from "../routes/types";
import SalaAPI from "../api/salasApi";
import { Ionicons } from "@expo/vector-icons";

type SalasNavigationProp = NavigationProp<RootStackParamList, "Salas">;

export default function SalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [filteredSalas, setFilteredSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<SalasNavigationProp>();
  const animatedValues = useRef<Animated.Value[]>([]).current;

  // Buscar salas
  const fetchSalas = async () => {
    if (!refreshing) setLoading(true);
    try {
      const data = await SalaAPI.getAllSalas();
      setSalas(data);
      setFilteredSalas(data);
      animatedValues.length = 0;
      data.forEach(() => animatedValues.push(new Animated.Value(0)));
      animateCards();
    } catch (error: any) {
      console.error("Erro ao carregar salas:", error.message || error);
      Alert.alert("Erro", "Não foi possível carregar as salas. Tente novamente.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  const animateCards = () => {
    const animations = animatedValues.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      })
    );
    Animated.stagger(50, animations).start();
  };

  // Filtrar salas
  useEffect(() => {
    filtrarSalas();
  }, [search, statusFiltro, salas]);

  const filtrarSalas = () => {
    let filtradas = salas;
    if (search.trim()) {
      filtradas = filtradas.filter((s) =>
        s.nome_numero?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFiltro) {
      filtradas = filtradas.filter(
        (s) => s.status_limpeza?.toLowerCase() === statusFiltro.toLowerCase()
      );
    }
    setFilteredSalas(filtradas);
  };

  const limparFiltro = () => {
    setStatusFiltro(null);
    setModalVisible(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSalas();
  };

  const criarSala = () => {
    navigation.navigate("FormSala", { onSalaCriada: fetchSalas } as any);
  };

  const abrirDetalhes = (s: Sala) => {
    const salaId = s.qr_code_id ?? s.id;
    navigation.navigate("SalaDetalhes", { salaId } as any);
  };

  const getStatusColor = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("suja")) return "#f44336";
    if (s.includes("em limpeza")) return "#ff9800";
    if (s.includes("pendente")) return "#9e9e9e";
    if (s.includes("limpa")) return "#4caf50";
    return "#000";
  };

  const renderSala = ({ item, index }: { item: Sala; index: number }) => {
    const translateY = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });
    const opacity = animatedValues[index];

    return (
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => abrirDetalhes(item)}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.nome_numero}</Text>
              <Text style={styles.descricao}>
                {item.descricao || "Sem descrição"}
              </Text>
              <Text style={styles.label}>
                Capacidade: {item.capacidade ?? "N/A"}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <Ionicons name="chevron-forward" size={24} color="#bbb" />
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
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#004A8D" />
        <Text style={{ marginTop: 12, fontSize: 16, color: "#004A8D" }}>
          Carregando salas...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar por nome da sala..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity
          style={styles.filterIcon}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="filter" size={24} color="#FF7300" />
        </TouchableOpacity>
      </View>

      {/* Lista de salas */}
      {filteredSalas.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 16, color: "#555" }}>
            Nenhuma sala encontrada.
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={filteredSalas}
          keyExtractor={(item) => String(item.qr_code_id ?? item.id)}
          renderItem={renderSala}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#004A8D"]}
            />
          }
        />
      )}

      {/* Botão fixo Criar Sala */}
      <TouchableOpacity
        style={styles.createButtonFixed}
        onPress={criarSala}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.createButtonText}>Criar Nova Sala</Text>
      </TouchableOpacity>

      {/* Modal de filtro */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por Status</Text>
            {["Limpeza Pendente", "Em Limpeza", "Limpa", "Suja"].map(
              (status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.modalButton,
                    statusFiltro === status ? styles.modalButtonActive : {},
                  ]}
                  onPress={() => setStatusFiltro(status)}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      statusFiltro === status
                        ? styles.modalButtonTextActive
                        : {},
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              )
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalActionText}>Aplicar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionButton, { backgroundColor: "#ccc" }]}
                onPress={limparFiltro}
              >
                <Text style={styles.modalActionText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    color: "#333",
  },
  filterIcon: {
    marginLeft: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nome: { fontSize: 18, fontWeight: "700", color: "#004A8D" },
  descricao: { fontSize: 14, color: "#555", marginVertical: 5 },
  label: { fontSize: 13, color: "#333", marginTop: 3 },
  statusContainer: { alignItems: "flex-end", marginLeft: 12 },
  status: { fontSize: 13, fontWeight: "700", marginTop: 6 },

  createButtonFixed: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#004A8D",
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: "#004A8D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: { color: "#fff", fontWeight: "bold", fontSize: 17, marginLeft: 6 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", width: "80%", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  modalButton: { paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: "#FF7300", borderRadius: 20, marginBottom: 10 },
  modalButtonActive: { backgroundColor: "#FF7300" },
  modalButtonText: { fontSize: 15, color: "#FF7300", fontWeight: "500" },
  modalButtonTextActive: { color: "#fff", fontWeight: "700" },
  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  modalActionButton: { flex: 1, paddingVertical: 10, borderRadius: 8, marginHorizontal: 5, backgroundColor: "#FF7300", alignItems: "center" },
  modalActionText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
