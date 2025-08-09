import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

// Definindo o tipo Sala
interface Sala {
  id: number;
  nome: string;
  status: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [salas, setSalas] = useState<Sala[]>([]); // Tipagem correta
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          navigation.navigate("Login" as never);
          return;
        }

        const response = await axios.get<Sala[]>("http://192.168.15.3:8000/salas/", {
          headers: { Authorization: `Token ${token}` },
        });

        setSalas(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar as salas.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalas();
  }, []);

  const marcarComoLimpa = async (salaId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `http://192.168.15.3:8000/salas/${salaId}/limpar/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );

      Alert.alert("Sucesso", "Sala marcada como limpa!");

      setSalas((prev) =>
        prev.map((sala) =>
          sala.id === salaId ? { ...sala, status: "Limpa" } : sala
        )
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível marcar como limpa.");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login" as never);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando salas...</Text>
      </View>
    );
  }

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

            <TouchableOpacity
              style={styles.botao}
              onPress={() => marcarComoLimpa(item.id)}
            >
              <Text style={styles.textoBotao}>Marcar como Limpa</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "orange" }]}
        onPress={() => navigation.navigate("HistoricoLimpezas" as never)}
      >
        <Text style={styles.textoBotao}>Ver Histórico</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "red" }]}
        onPress={logout}
      >
        <Text style={styles.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  nome: { fontSize: 18, fontWeight: "bold" },
  botao: {
    backgroundColor: "green",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  textoBotao: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
