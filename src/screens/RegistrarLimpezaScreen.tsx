import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "../api/api";
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../routes/types";

// Tipagem do route e navigation
type RegistrarLimpezaRouteProp = RouteProp<RootStackParamList, "RegistrarLimpeza">;
type RegistrarLimpezaNavigationProp = NavigationProp<RootStackParamList, "RegistrarLimpeza">;

export default function RegistrarLimpezaScreen() {
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  const route = useRoute<RegistrarLimpezaRouteProp>();
  const navigation = useNavigation<RegistrarLimpezaNavigationProp>();
  const { salaId } = route.params || {};

  const handleRegistrarLimpeza = async () => {
    if (!salaId) {
      Alert.alert("Erro", "Sala inválida.");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/salas/${salaId}/registrar-limpeza/`, { observacao });
      Alert.alert("Sucesso", "Limpeza registrada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao registrar limpeza:", error);
      Alert.alert("Erro", "Não foi possível registrar a limpeza.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Limpeza</Text>

      <Text style={styles.label}>Observação:</Text>
      <TextInput
        style={styles.input}
        placeholder="Escreva uma observação (opcional)"
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleRegistrarLimpeza}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Registrando..." : "Confirmar Limpeza"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F6F9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004A8D",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    minHeight: 60,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#004A8D",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
