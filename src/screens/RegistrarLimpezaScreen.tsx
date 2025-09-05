import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function RegistrarLimpezaScreen({ route, navigation }: any) {
  const { token, user } = useAuth();
  const { salaId } = route.params; // salaId vem da tela de detalhes
  const [observacao, setObservacao] = useState("");

  const registrarLimpeza = async () => {
    if (!observacao.trim()) {
      Alert.alert("Atenção", "Digite uma observação antes de registrar.");
      return;
    }

    try {
      await api.post(
        "/limpezas/",
        {
          sala: salaId,
          observacao,
          usuario: user?.username,
        },
        { headers: { Authorization: `Token ${token}` } }
      );

      Alert.alert("✅ Sucesso", "Limpeza registrada!");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Erro ao registrar limpeza:", error);
      Alert.alert("Erro", "Não foi possível registrar a limpeza.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Limpeza</Text>
      <Text style={styles.label}>Sala ID: {salaId}</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite uma observação..."
        value={observacao}
        onChangeText={setObservacao}
      />
      <Button title="Registrar" onPress={registrarLimpeza} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginBottom: 12 },
});
