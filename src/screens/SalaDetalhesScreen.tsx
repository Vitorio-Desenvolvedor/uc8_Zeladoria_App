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
import { Ionicons } from "@expo/vector-icons";
import SalaAPI from "../api/salasApi";
import { AuthContext } from "../context/AuthContext";
import { RootStackParamList, Sala } from "../routes/types";

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
    Limpa: "#27AE60",
    "Em Limpeza": "#F39C12",
    "Limpeza Pendente": "#7F8C8D",
    Suja: "#C0392B",
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
              Alert.alert("Sucesso", "Sala excluída com sucesso!");
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
    Alert.alert("Marcar como Suja", "Deseja realmente marcar esta sala como suja?", [
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
    ]);
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

      <View style={styles.infoCard}>
        <InfoBox label="Localização" value={sala.localizacao ?? "N/A"} />
        <InfoBox label="Capacidade" value={sala.capacidade ?? "N/A"} />
        <InfoBox label="Descrição" value={sala.descricao ?? "Sem descrição"} />
        <InfoBox
          label="Status"
          value={sala.status_limpeza}
          valueStyle={{
            color: statusColors[sala.status_limpeza] || "#000",
            fontWeight: "bold",
          }}
        />
      </View>

      <View style={styles.actionContainer}>
        <ActionButton
          icon="play"
          text="Iniciar"
          color="#004A8D"
          background="#D6EAF8"
          onPress={() =>
            navigation.navigate("IniciarLimpeza", {
              salaId,
              onSuccess: fetchSalaDetalhes,
            } as any)
          }
        />

        <ActionButton
          icon="checkmark-done"
          text="Finalizar"
          color="#117A65"
          background="#D1F2EB"
          onPress={() =>
            navigation.navigate("ConcluirLimpeza", {
              salaId,
              onSuccess: fetchSalaDetalhes,
            } as any)
          }
        />

        <ActionButton
          icon="alert-circle"
          text="Marcar Suja"
          color="#C0392B"
          background="#FADBD8"
          onPress={marcarComoSuja}
        />
      </View>

      {/* BOTÕES ADMINISTRATIVOS */}
      {user?.is_superuser && (
        <>
          <View style={styles.actionContainer}>
            <ActionButton
              icon="create"
              text="Editar"
              color="#E67E22"
              background="#FFF3CD"
              onPress={editarSala}
            />

            <ActionButton
              icon="trash"
              text="Excluir"
              color="#C0392B"
              background="#F5B7B1"
              onPress={excluirSala}
            />
          </View>
        </>
      )}
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

function ActionButton({
  icon,
  text,
  color,
  background,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  color: string;
  background: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: background }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.actionText, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9F9", padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
  subtitle: { fontSize: 18, color: "#555", textAlign: "center", marginBottom: 15 },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  infoBox: { marginBottom: 10 },
  label: { fontWeight: "bold", color: "#333" },
  value: { color: "#555", fontSize: 15 },

  actionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 4,
  },
  actionText: { marginLeft: 6, fontWeight: "600" },
});
