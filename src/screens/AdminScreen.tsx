import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { api } from "../api/api";

interface Sala {
  id: number;
  nome: string;
  descricao: string;
}

export default function AdminScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);

  async function carregar() {
    const res = await api.get("/salas/");
    setSalas(res.data);
  }

  async function deletar(id: number) {
    try {
      await api.delete(`/salas/${id}/`);
      Alert.alert("Sala removida!");
      carregar();
    } catch {
      Alert.alert("Erro ao excluir sala");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <FlatList
      data={salas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18 }}>{item.nome}</Text>
          <Button title="Excluir" onPress={() => deletar(item.id)} />
        </View>
      )}
    />
  );
}
