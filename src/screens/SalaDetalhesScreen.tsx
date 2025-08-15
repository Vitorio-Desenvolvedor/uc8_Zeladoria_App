import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SalaDetalhesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sala } = route.params as { sala: { id: number; nome: string } };

  const [observacao, setObservacao] = useState("");

  const registrarLimpeza = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.post(
        `http://192.168.15.3:8000/salas/historico/listar/`, // rota corrigida
        {
          sala: sala.id,
          observacao: observacao,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      Alert.alert("Sucesso", "Limpeza registrada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível registrar a limpeza.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sala: {sala.nome}</Text>
      <TextInput
        style={styles.input}
        placeholder="Observação"
        value={observacao}
        onChangeText={setObservacao}
      />
      <Button title="Marcar como limpa" onPress={registrarLimpeza} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});
