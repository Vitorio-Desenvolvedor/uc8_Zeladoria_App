import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { RouteProp, useRoute } from "@react-navigation/native";

type RegistroRouteProps = RouteProp<{ params: { salaId: number } }, "params">;

export default function RegistroLimpezaScreen() {
  const route = useRoute<RegistroRouteProps>();
  const { token } = useAuth();
  const [observacao, setObservacao] = useState("");

  const registrarLimpeza = () => {
    axios
      .post(
        "http://192.168.15.3:8000/api/limpezas/",
        {
          sala: route.params.salaId,
          observacao,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      )
      .then(() => {
        Alert.alert("Sucesso", "Limpeza registrada!");
      })
      .catch(() => {
        Alert.alert("Erro", "Não foi possível registrar a limpeza.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Limpeza</Text>
      <TextInput
        style={styles.input}
        placeholder="Observação"
        value={observacao}
        onChangeText={setObservacao}
      />
      <Button title="Salvar" onPress={registrarLimpeza} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 20, borderRadius: 5 },
});
