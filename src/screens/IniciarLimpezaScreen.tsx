import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";
import SalaAPI from "../api/salasApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "IniciarLimpeza">;

export default function IniciarLimpezaScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { salaId } = route.params; // removido o onSuccess para evitar warning

  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIniciar = async () => {
    if (loading) return;

    try {
      setLoading(true);
      console.log("🧹 Iniciando limpeza para sala:", salaId);

      const response = await SalaAPI.iniciarLimpeza(salaId, observacao);

      if (!response?.id) {
        throw new Error("Resposta inválida da API. Registro de limpeza não retornado.");
      }

      Alert.alert("Sucesso", "Limpeza iniciada com sucesso!", [
        {
          text: "Ir para conclusão",
          onPress: () =>
            navigation.navigate("ConcluirLimpeza", {
              salaId,
              registroId: response.id, // envia o registro da limpeza corretamente
            }),
        },
      ]);
    } catch (error: any) {
      console.error("Erro ao iniciar limpeza:", error.response?.data || error.message);
      Alert.alert(
        "Erro",
        error.response?.data?.detail || "Não foi possível iniciar a limpeza. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Limpeza</Text>

      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Observações (opcional)"
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      {loading ? (
        <ActivityIndicator size="large" color="#004A8D" />
      ) : (
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleIniciar}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Iniciar Limpeza</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#004A8D",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#004A8D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
