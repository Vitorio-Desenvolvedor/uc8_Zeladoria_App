import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

// Definindo tipo do histórico
interface Limpeza {
  id: number;
  sala_nome: string;
  observacao: string;
  data: string;
  usuario: string;
}

export default function HistoricoLimpezasScreen() {
  const [historico, setHistorico] = useState<Limpeza[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          navigation.navigate("Login" as never);
          return;
        }

        const response = await axios.get<Limpeza[]>("http://192.168.15.3:8000/historico/", {
          headers: { Authorization: `Token ${token}` },
        });

        setHistorico(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar o histórico.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico de Limpezas</Text>

      {historico.length === 0 ? (
        <Text style={{ marginTop: 20 }}>Nenhuma limpeza registrada.</Text>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nomeSala}>{item.sala_nome}</Text>
              <Text>Observação: {item.observacao || "Sem observação"}</Text>
              <Text>Data: {new Date(item.data).toLocaleString()}</Text>
              <Text>Responsável: {item.usuario}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: "gray" }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoBotao}>Voltar</Text>
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
  nomeSala: { fontSize: 18, fontWeight: "bold" },
  botao: {
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  textoBotao: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
