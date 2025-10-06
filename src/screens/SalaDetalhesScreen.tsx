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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Sala } from "../routes/types";
import { Ionicons } from "@expo/vector-icons";
import SalaAPI from "../api/salasApi";

// Tipagem de rota e navegação
type SalaDetalhesRouteProp = RouteProp<RootStackParamList, "SalaDetalhes">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "SalaDetalhes">;

export default function SalaDetalhesScreen() {
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

  // Buscar detalhes da sala
  const fetchSalaDetalhes = async () => {
    try {
      setLoading(true);
      const data = await SalaAPI.getSalaById(salaId);
      setSala(data);
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

  // Editar sala
  const editarSala = () => {
    navigation.navigate("FormEditSala", {
      salaId,
      onSalaAtualizada: fetchSalaDetalhes,
    } as any);
  };

  // Excluir sala
  const excluirSala = () => {
    Alert.alert(
      "Excluir Sala",
      `Tem certeza que deseja excluir a sala "${sala?.nome_numero}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await SalaAPI.deleteSala(salaId);
              Alert.alert("Sucesso", "Sala excluída com sucesso!");
              navigation.goBack();
            } catch (error: any) {
              console.error("Erro ao excluir sala:", error.message);
              Alert.alert("Erro", "Não foi possível excluir a sala.");
            }
          },
        },
      ]
    );
  };

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
      {/* Título */}
      <Text style={styles.title}>Detalhes da Sala</Text>
      <Text style={styles.subtitle}>{sala.nome_numero}</Text>

      {/* Informações */}
      <InfoBox label="Localização" value={sala.localizacao ?? "N/A"} />
      <InfoBox label="Capacidade" value={sala.capacidade ?? "N/A"} />
      <InfoBox label="Descrição" value={sala.descricao ?? "Sem descrição"} />
      <InfoBox
        label="Status da Limpeza"
        value={sala.status_limpeza ?? "Desconhecido"}
        valueStyle={{
          color: statusColors[sala.status_limpeza ?? ""] || "red",
          fontWeight: "bold",
        }}
      />
      <InfoBox
        label="Última Limpeza"
        value={
          sala.ultima_limpeza_data_hora
            ? sala.ultima_limpeza_data_hora
            : "Nunca registrada"
        }
      />
      <InfoBox
        label="Funcionário Responsável"
        value={sala.ultima_limpeza_funcionario || "N/A"}
      />

      {/* Botões de ação horizontais */}
      <View style={styles.actions}>
        {/* Registrar Limpeza */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: "rgba(0, 122, 255, 0.15)" },
          ]}
          onPress={() => navigation.navigate("RegistrarLimpeza", { salaId })}
        >
          <Ionicons name="checkmark-done" size={20} color="#004A8D" />
          <Text style={styles.actionText}>Registrar</Text>
        </TouchableOpacity>

        {/* Editar Sala */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: "rgba(255, 165, 0, 0.15)" },
          ]}
          onPress={editarSala}
        >
          <Ionicons name="create" size={20} color="#FFA500" />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

        {/* Excluir Sala */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: "rgba(229, 57, 53, 0.15)" },
          ]}
          onPress={excluirSala}
        >
          <Ionicons name="trash" size={20} color="#E53935" />
          <Text style={styles.actionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Componente InfoBox
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
  container: { flex: 1, backgroundColor: "#F4F6F9", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },

  infoBox: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "600", color: "#333" },
  value: { fontSize: 15, color: "#555", marginTop: 3 },

  actions: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
