import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import API from "../../api/api";

type Sala = {
  id: number;
  nome: string;
  localizacao: string;
};

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [salas, setSalas] = useState<Sala[]>([]);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const res = await API.get("/api/salas/");
        setSalas(res.data);
      } catch (error) {
        console.log("Erro ao buscar salas:", error);
      }
    };
    fetchSalas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {user?.username}</Text>
      <Button
        title="Ver Histórico de Limpezas"
        onPress={() => navigation.navigate("Historico")}
      />
      <Button title="Sair" color="red" onPress={logout} />

      <Text style={styles.subtitle}>Salas cadastradas:</Text>
      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.nome} - {item.localizacao}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  subtitle: { fontSize: 18, marginTop: 20 },
});
