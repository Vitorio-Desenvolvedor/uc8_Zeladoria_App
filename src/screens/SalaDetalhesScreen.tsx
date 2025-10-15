import React, { useContext, useEffect, useState } from "react";
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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Sala } from "../routes/types";
import { Ionicons } from "@expo/vector-icons";
import SalaAPI from "../api/salasApi";
import { AuthContext } from "../context/AuthContext";

type SalaDetalhesRouteProp = RouteProp<RootStackParamList, "SalaDetalhes">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "SalaDetalhes">;

export default function SalaDetalhesScreen() {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;

  const { user } = authContext;
  const route = useRoute<SalaDetalhesRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { salaId } = route.params;

  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState(true);

  const statusColors: Record<string, string> = {
    Limpa: "green",
    "Em Limpeza": "orange",
    "Limpeza Pendente": "gray",
    Suja: "red",
  };

  const fetchSalaDetalhes = async () => {
    try {
      setLoading(true);
      const data = await SalaAPI.getSalaById(salaId);
      setSala(data);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar os detalhes da sala.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaDetalhes();
  }, [salaId]);

  const editarSala = () => {
    navigation.navigate("FormEditSala", {
      salaId,
      onSalaAtualizada: fetchSalaDetalhes,
    } as any);
  };

  const excluirSala = () => {
    Alert.alert(
      "Excluir Sala",
      `Tem certeza que deseja excluir "${sala?.nome_numero}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await SalaAPI.deleteSala(salaId);
              Alert.alert("Sucesso", "Sala excluída!");
              navigation.goBack();
            } catch (error: any) {
              Alert.alert("Erro", "Não foi possível excluir a sala.");
            }
          },
        },
      ]
    );
  };

  const marcarComoSuja = async () => {
    Alert.alert(
      "Marcar como Suja",
      "Tem certeza que deseja marcar esta sala como suja?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await SalaAPI.marcarComoSuja(salaId);
              Alert.alert("Sucesso", "Sala marcada como suja!");
              fetchSalaDetalhes();
            } catch (error: any) {
              console.error(error);
              Alert.alert("Erro", "Não foi possível marcar como suja.");
            }
          },
        },
      ]
    );
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004A8D" />
        <Text>Carregando...</Text>
      </View>
    );

  if (!sala)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Sala não encontrada.</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalhes da Sala</Text>
      <Text style={styles.subtitle}>{sala.nome_numero}</Text>

      <InfoBox label="Localização" value={sala.localizacao ?? "N/A"} />
      <InfoBox label="Capacidade" value={sala.capacidade ?? "N/A"} />
      <InfoBox label="Descrição" value={sala.descricao ?? "Sem descrição"} />
      <InfoBox
        label="Status"
        value={sala.status_limpeza}
        valueStyle={{
          color: statusColors[sala.status_limpeza] || "black",
          fontWeight: "bold",
        }}
      />

      <View style={styles.actions}>
        {/* INICIAR LIMPEZA */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#D6EAF8" }]}
          onPress={() =>
            navigation.navigate("IniciarLimpeza", {
              salaId,
              onSuccess: fetchSalaDetalhes,
            } as any)
          }
        >
          <Ionicons name="play" size={20} color="#004A8D" />
          <Text style={styles.actionText}>Iniciar</Text>
        </TouchableOpacity>

        {/* --- FINALIZAR LIMPEZA --- */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#D1F2EB" }]}
          onPress={() =>
            navigation.navigate("ConcluirLimpeza", {
              salaId,
              onSuccess: fetchSalaDetalhes,
            } as any)
          }
        >
          <Ionicons name="checkmark-done" size={20} color="#117A65" />
          <Text style={styles.actionText}>Finalizar</Text>
        </TouchableOpacity>

        {/* --- MARCAR COMO SUJA --- */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#FADBD8" }]}
          onPress={marcarComoSuja}
        >
          <Ionicons name="alert-circle" size={20} color="#E74C3C" />
          <Text style={styles.actionText}>Marcar Suja</Text>
        </TouchableOpacity>

        {/* --- BOTÕES EXCLUSIVOS DO ADMIN --- */}
        {user?.is_superuser && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#FFF3CD" }]}
              onPress={editarSala}
            >
              <Ionicons name="create" size={20} color="#E67E22" />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#F5B7B1" }]}
              onPress={excluirSala}
            >
              <Ionicons name="trash" size={20} color="#C0392B" />
              <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function InfoBox({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string | number;
  valueStyle?: object;
}) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9F9", padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 18, color: "#555", textAlign: "center", marginBottom: 15 },
  infoBox: { marginBottom: 10 },
  label: { fontWeight: "bold", color: "#333" },
  value: { color: "#555" },
  actions: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 5,
  },
  actionText: { marginLeft: 6, fontWeight: "600" },
});
