import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";
import SalaAPI from "../api/salasApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "IniciarLimpeza">;

export default function RegistrarLimpezaScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { salaId, onSuccess } = route.params;

  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIniciar = async () => {
    try {
      setLoading(true);
      await SalaAPI.iniciarLimpeza(salaId, observacao);
      Alert.alert("Sucesso", "Limpeza iniciada!");
      if (onSuccess) onSuccess();
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.detail || "Falha ao iniciar limpeza.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Limpeza</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Observações (opcional)"
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />
      {loading ? (
        <ActivityIndicator size="large" color="#004A8D" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleIniciar}>
          <Text style={styles.buttonText}>Iniciar Limpeza</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9F9", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#004A8D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
