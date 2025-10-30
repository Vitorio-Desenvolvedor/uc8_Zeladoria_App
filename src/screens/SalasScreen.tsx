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
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList, Sala } from "../routes/types";
import SalaAPI from "../api/salasApi";
import { Ionicons } from "@expo/vector-icons";

type SalasNavigationProp = NavigationProp<RootStackParamList, "Salas">;

export default function SalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<SalasNavigationProp>();

  // Animations refs
  const animatedValues = useRef<Animated.Value[]>([]).current;

  // Buscar todas as salas
  const fetchSalas = async () => {
    if (!refreshing) setLoading(true);

    try {
      const data = await SalaAPI.getAllSalas();
      setSalas(data);

      // Inicializa animações
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
              <Text style={styles.descricao}>{item.descricao || "Sem descrição"}</Text>
              <Text style={styles.label}>Capacidade: {item.capacidade ?? "N/A"}</Text>
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
      <TouchableOpacity
        style={styles.createButton}
        onPress={criarSala}
        activeOpacity={0.8}
      >
        <Text style={styles.createButtonText}>+ Criar Nova Sala</Text>
      </TouchableOpacity>

      {salas.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 16, color: "#555" }}>
            Nenhuma sala encontrada.
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={salas}
          keyExtractor={(item) => String(item.qr_code_id ?? item.id)}
          renderItem={renderSala}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#004A8D']} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f6f9",
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
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#004A8D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#004A8D",
  },
  descricao: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  label: {
    fontSize: 13,
    color: "#333",
    marginTop: 3,
  },
  statusContainer: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  status: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },
});
