import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { api } from "../api/api";

export default function RegistroLimpezaScreen() {
  const [salaId, setSalaId] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  const salvar = async () => {
    try {
      if (!salaId) return Alert.alert("Atenção", "Informe o ID da sala.");
      setLoading(true);
      // Exemplo de payload esperado no backend:
      // { sala: <id>, observacao: "..." }
      await api.post("/api/limpezas/", {
        sala: Number(salaId),
        observacao,
      });
      Alert.alert("Sucesso", "Limpeza registrada.");
      setObservacao("");
      setSalaId("");
    } catch (e: any) {
      Alert.alert("Erro", e?.response?.data?.detail ?? "Não foi possível registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Limpeza</Text>
      <TextInput
        placeholder="ID da sala"
        keyboardType="numeric"
        value={salaId}
        onChangeText={setSalaId}
        style={styles.input}
      />
      <TextInput
        placeholder="Observação"
        value={observacao}
        onChangeText={setObservacao}
        style={styles.input}
      />
      <Button title={loading ? "Salvando..." : "Salvar"} onPress={salvar} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 20, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10, borderRadius: 8 },
});
