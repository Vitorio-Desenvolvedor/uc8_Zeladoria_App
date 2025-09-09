import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert, StyleSheet } from "react-native";
import api from "../api/api";
import { Sala } from "../api/apiTypes";
import { useAuth } from "../context/AuthContext";

export default function TelaAdminSalas({ navigation }: any) {
  const { token } = useAuth();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Carregar salas
  const fetchSalas = async () => {
    setLoading(true);
    try {
      const response = await api.get<Sala[]>("/salas/");
      setSalas(response.data);
    } catch (error) {
      console.error("Erro ao buscar salas:", error);
      Alert.alert("Erro", "Não foi possível carregar as salas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  // Função para excluir sala
  const excluirSala = async (id: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente excluir esta sala?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/salas/${id}/`);
              setSalas(salas.filter((s) => s.id !== id));
              Alert.alert("Sucesso", "Sala excluída com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir sala:", error);
              Alert.alert("Erro", "Não foi possível excluir a sala.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Adicionar Nova Sala" onPress={() => navigation.navigate("FormSala")} />
      <FlatList
        data={salas}
        refreshing={loading}
        onRefresh={fetchSalas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome_numero}</Text>
            <Text>Status: {item.status_limpeza}</Text>
            <View style={styles.buttons}>
              <Button
                title="Editar"
                onPress={() => navigation.navigate("FormSala", { sala: item })}
              />
              <Button
                title="Excluir"
                color="red"
                onPress={() => excluirSala(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  nome: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
});
