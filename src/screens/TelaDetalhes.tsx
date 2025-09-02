import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  TelaDetalhes: { salaId: number; token: string };
};

type TelaDetalhesRouteProp = RouteProp<RootStackParamList, "TelaDetalhes">;

export default function TelaDetalhes() {
  const route = useRoute<TelaDetalhesRouteProp>();
  const navigation = useNavigation();
  const { salaId, token } = route.params;

  const [sala, setSala] = useState<any>(null);
  const [observacao, setObservacao] = useState("");

  // Busca detalhes da sala
  const buscarSala = async () => {
    try {
      const response = await axios.get(
        `http://192.168.15.3:8000/salas/${salaId}/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setSala(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes da sala");
    }
  };

  // Marcar como limpa
  const marcarComoLimpa = async () => {
    try {
      await axios.post(
        "http://192.168.15.3:8000/limpezas/",
        {
          sala: salaId,
          observacao,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      Alert.alert("Sucesso", "Sala marcada como limpa");
      buscarSala(); // Atualiza os dados
      setObservacao("");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível registrar a limpeza");
    }
  };

  useEffect(() => {
    buscarSala();
  }, []);

  if (!sala) {
    return (
      <View style={styles.container}>
        <Text>Carregando detalhes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sala.nome}</Text>
      <Text>Status: {sala.status}</Text>

      <Text style={{ marginTop: 20 }}>Observação:</Text>
      <TextInput
        style={styles.input}
        value={observacao}
        onChangeText={setObservacao}
        placeholder="Digite observação..."
      />

      <Button title="Marcar como Limpa" onPress={marcarComoLimpa} />
      <View style={{ marginTop: 10 }}>
        <Button
          title="Ver Histórico de Limpezas"
          onPress={() =>
            // navigation.navigate("HistoricoLimpezas" as never, { salaId, token } as never 
            console.log()
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
});
