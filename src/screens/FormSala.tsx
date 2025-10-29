import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../routes/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SalaAPI from "../api/salasApi";

type FormSalaRouteProp = RouteProp<RootStackParamList, "FormSala">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "FormSala">;

export default function FormSalaScreen() {
  const route = useRoute<FormSalaRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const onSalaCriada = route.params?.onSalaCriada;

  const [nomeNumero, setNomeNumero] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para criar uma nova sala
  const handleCreate = async () => {
    if (!nomeNumero.trim()) {
      Alert.alert("Atenção", "Informe o nome ou número da sala.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        nome_numero: nomeNumero,
        capacidade: capacidade ? parseInt(capacidade, 10) : undefined,
        localizacao: localizacao || undefined,
        descricao: descricao || undefined,
      };

      const novaSala = await SalaAPI.createSala(payload as any);

      Alert.alert("Sucesso", "Sala criada com sucesso!");

      // Chama callback opcional e volta para a tela anterior
      if (typeof onSalaCriada === "function") {
        try {
          await onSalaCriada();
        } catch {}
      }

      navigation.goBack();
    } catch (error: any) {
      console.error(
        "Erro ao criar sala:",
        error.response?.data || error.message || error
      );
      Alert.alert("Erro", "Não foi possível criar a sala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Criar Nova Sala</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome ou Número"
        value={nomeNumero}
        onChangeText={setNomeNumero}
      />
      <TextInput
        style={styles.input}
        placeholder="Capacidade"
        keyboardType="numeric"
        value={capacidade}
        onChangeText={setCapacidade}
      />
      <TextInput
        style={styles.input}
        placeholder="Localização"
        value={localizacao}
        onChangeText={setLocalizacao}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição (opcional)"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      {loading ? (
        <ActivityIndicator size="large" color="#004A8D" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Criar Sala</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F6F9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",  
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#004A8D",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
