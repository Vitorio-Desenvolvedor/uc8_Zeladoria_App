import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";
import SalaAPI from "../api/salasApi";

// Tipagem das rotas
type RegistrarLimpezaRouteProp = RouteProp<RootStackParamList, "RegistrarLimpeza">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "RegistrarLimpeza">;

export default function RegistrarLimpezaScreen() {
  const route = useRoute<RegistrarLimpezaRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { salaId } = route.params;

  const [observacao, setObservacao] = useState("");
  const [funcionario, setFuncionario] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para registrar a limpeza usando SalaAPI
  const handleRegistrar = async () => {
    if (!funcionario.trim()) {
      Alert.alert("Erro", "Informe o nome do funcionário responsável.");
      return;
    }

    try {
      setLoading(true);

      await SalaAPI.registrarLimpeza(salaId, observacao, funcionario);

      Alert.alert("Sucesso", "Limpeza registrada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error("Erro ao registrar limpeza:", error.message || error);
      Alert.alert("Erro", "Não foi possível registrar a limpeza.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Limpeza</Text>

      <Text style={styles.label}>Funcionário Responsável</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do funcionário"
        value={funcionario}
        onChangeText={setFuncionario}
      />

      <Text style={styles.label}>Observação</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Digite observações (opcional)"
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      {loading ? (
        <ActivityIndicator size="large" color="#004A8D" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegistrar}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#004A8D",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
