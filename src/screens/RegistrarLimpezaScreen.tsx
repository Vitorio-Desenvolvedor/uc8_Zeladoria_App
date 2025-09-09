import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../api/api";
import { Sala, NovaLimpeza } from "../api/apiTypes";

export default function RegistrarLimpezaScreen({ navigation }: any) {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [salaSelecionada, setSalaSelecionada] = useState<number | null>(null);
  const [observacao, setObservacao] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchSalas = async () => {
    try {
      const response = await api.get<Sala[]>("/salas/");
      setSalas(response.data);
    } catch (error) {
      console.error("Erro ao carregar salas:", error);
      Alert.alert("Erro", "Não foi possível carregar as salas.");
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  // Registrar limpeza
  const registrarLimpeza = async () => {
    if (!salaSelecionada) {
      Alert.alert("Atenção", "Selecione uma sala.");
      return;
    }

    const novaLimpeza: NovaLimpeza = {
      sala: salaSelecionada,
      observacao,
    };

    setLoading(true);
    try {
      await api.post("/limpezas/", novaLimpeza);
      Alert.alert("Sucesso", "Limpeza registrada com sucesso!");
      navigation.navigate("Historico"); 
    } catch (error) {
      console.error("Erro ao registrar limpeza:", error);
      Alert.alert("Erro", "Não foi possível registrar a limpeza.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Limpeza</Text>

      <Text style={styles.label}>Sala:</Text>
      <Picker
        selectedValue={salaSelecionada}
        onValueChange={(itemValue) => setSalaSelecionada(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma sala" value={null} />
        {salas.map((sala) => (
          <Picker.Item key={sala.id} label={sala.nome_numero} value={sala.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Observação (opcional):</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite uma observação..."
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={registrarLimpeza} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, marginBottom: 8 },
  picker: { backgroundColor: "#fff", borderRadius: 8, marginBottom: 16 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
    minHeight: 80,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
