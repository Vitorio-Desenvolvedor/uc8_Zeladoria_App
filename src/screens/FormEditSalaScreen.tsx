import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList, Sala } from "../routes/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import api from "../api/api";

// Tipagens da Rota
type FormEditSalaRouteProp = RouteProp<RootStackParamList, "FormEditSala">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "FormEditSala">;

export default function FormEditSalaScreen() {
  const route = useRoute<FormEditSalaRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { salaId } = route.params;

  const [nome, setNome] = useState("");
  const [capacidade, setCapacidade] = useState(""); // sempre string p/ TextInput
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  //  Buscar dados da sala ao carregar
  useEffect(() => {
    const fetchSala = async () => {
      try {
        const response = await api.get<Sala>(`/salas/${salaId}/`);
        const sala = response.data;

        // Garantindo que valores nulos sejam convertidos em strings seguras
        setNome(sala.nome_numero);
        setCapacidade(sala.capacidade ? String(sala.capacidade) : "");
        setLocalizacao(sala.localizacao ?? "");
        setDescricao(sala.descricao ?? "");
      } catch (error) {
        console.error("Erro ao carregar sala:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados da sala.");
      }
    };

    fetchSala();
  }, [salaId]);

  // 🔹 Atualizar sala
  const handleUpdate = async () => {
    if (!nome || !capacidade || !localizacao) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/salas/${salaId}/`, {
        nome_numero: nome,
        capacidade: parseInt(capacidade, 10), // garante número inteiro
        localizacao,
        descricao,
      });

      Alert.alert("Sucesso", "Sala atualizada com sucesso!");
      navigation.goBack();
    } catch (error: any) {
      console.error("Erro ao atualizar sala:", error);
      Alert.alert("Erro", "Não foi possível atualizar a sala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Editar Sala</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome ou Número da Sala"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Capacidade"
        value={capacidade}
        keyboardType="numeric"
        onChangeText={setCapacidade}
      />

      <TextInput
        style={styles.input}
        placeholder="Localização"
        value={localizacao}
        onChangeText={setLocalizacao}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#aaa" }]}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F4F6F9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#333" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
