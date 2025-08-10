import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type Sala = {
  id: number;
  nome: string;
  status: string;
};

export default function SalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [observacao, setObservacao] = useState<string>("");

  useEffect(() => {
    buscarSalas();
  }, []);

  const buscarSalas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("http://192.168.15.3:8000/api/salas/", {
        headers: { Authorization: `Token ${token}` },
      });
      setSalas(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as salas.");
    }
  };

  const marcarComoLimpa = async (id: number) => {
    if (!observacao.trim()) {
      Alert.alert("Aviso", "Digite uma observação antes de enviar.");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `http://192.168.15.3:8000/api/limpezas/`,
        { sala: id, observacao },
        { headers: { Authorization: `Token ${token}` } }
      );
      Alert.alert("Sucesso", "Sala marcada como limpa!");
      setObservacao("");
      buscarSalas();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível registrar a limpeza.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Salas</Text>
      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Status: {item.status}</Text>
            <TextInput
              style={styles.input}
              placeholder="Observação"
              value={observacao}
              onChangeText={setObservacao}
            />
            <TouchableOpacity
              style={styles.botao}
              onPress={() => marcarComoLimpa(item.id)}
            >
              <Text style={styles.textoBotao}>Marcar como Limpa</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  nome: { fontSize: 18, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 8,
  },
  botao: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
});
