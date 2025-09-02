import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { api } from "../api/api";


export default function LimpezaScreen({ route, navigation }: any) {
  const { salaId } = route.params;
  const [observacao, setObservacao] = useState("");

  async function registrar() {
    try {
      await api.post("/limpezas/", { sala: salaId, observacao });
      alert("Limpeza registrada!");
      navigation.goBack();
    } catch (err) {
      alert("Erro ao registrar limpeza.");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Observação"
        value={observacao}
        onChangeText={setObservacao}
        style={styles.input}
      />
      <Button title="Salvar" onPress={registrar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});
