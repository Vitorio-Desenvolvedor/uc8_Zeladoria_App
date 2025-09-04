import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { registrarLimpeza } from "../api/limpeza";
import { RootStackParamList } from "../routes/types";

// Tipagem da rota
type RegistrarLimpezaRouteProp = RouteProp<RootStackParamList, "RegistroLimpeza">;

export default function RegistrarLimpezaScreen() {
  const { token, user } = useAuth();
  const route = useRoute<RegistrarLimpezaRouteProp>();
  const navigation = useNavigation();
  const { salaId } = route.params;

  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    if (!token) return Alert.alert("Erro", "Usuário não autenticado.");
    try {
      setLoading(true);
      await registrarLimpeza(token, salaId, observacao, "limpa");
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

      <TextInput
        style={styles.input}
        placeholder="Observações..."
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#aaa" }]}
        onPress={handleRegistro}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Salvando..." : "Confirmar"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    height: 120,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
