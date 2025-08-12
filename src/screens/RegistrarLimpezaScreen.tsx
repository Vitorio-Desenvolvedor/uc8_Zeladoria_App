import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

type Sala = {
  id: number;
  nome: string;
};

export default function RegistrarLimpezaScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [observacao, setObservacao] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    async function carregarSalas() {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get("http://192.168.15.3:8000/salas/", {
          headers: { Authorization: `Token ${token}` },
        });
        setSalas(response.data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as salas.");
      }
    }
    carregarSalas();
  }, []);

  async function marcarComoLimpa(id: number) {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        "http://192.168.15.3:8000/limpezas/",
        {
          sala: id,
          observacao: observacao || "",
        },
        { headers: { Authorization: `Token ${token}` } }
      );
      Alert.alert("Sucesso", "Limpeza registrada com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível registrar a limpeza.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Limpeza</Text>
      <TextInput
        style={styles.input}
        placeholder="Observação (opcional)"
        value={observacao}
        onChangeText={setObservacao}
      />
      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nome}</Text>
            <Button title="Marcar como Limpa" onPress={() => marcarComoLimpa(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
