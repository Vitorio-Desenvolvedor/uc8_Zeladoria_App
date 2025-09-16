import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../routes/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

type RegistrarLimpezaRouteProp = RouteProp<
  RootStackParamList,
  "RegistrarLimpeza"
>;
type RegistrarLimpezaNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RegistrarLimpeza"
>;

export default function RegistrarLimpezaScreen() {
  const route = useRoute<RegistrarLimpezaRouteProp>();
  const navigation = useNavigation<RegistrarLimpezaNavigationProp>();
  const { salaId } = route.params;
  const { token, user } = useAuth();

  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  const registrarLimpeza = async () => {
    if (!token) {
      Alert.alert("Erro", "Você precisa estar logado para registrar uma limpeza.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        `/salas/${salaId}/registrar_limpeza/`,
        {
          observacao,
          funcionario: user?.username || "colaborador",
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      Alert.alert("Sucesso", "Limpeza registrada com sucesso!");
      navigation.navigate("SalaDetalhes", { salaId }); // retorna para detalhes
    } catch (error: any) {
      console.error("Erro ao registrar limpeza:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível registrar a limpeza.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Limpeza</Text>
      <Text style={styles.subtitle}>Sala ID: {salaId}</Text>

      <TextInput
        style={styles.input}
        placeholder="Observação (opcional)"
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#ccc" }]}
        onPress={registrarLimpeza}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Confirmar Registro</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#E53935" }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F4F6F9" },
  title: { fontSize: 22, fontWeight: "bold", color: "#004A8D", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    height: 100,
  },
  button: {
    backgroundColor: "#004A8D",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
