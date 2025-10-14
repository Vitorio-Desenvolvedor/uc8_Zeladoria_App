import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { RootStackParamList } from "../routes/types";
import SalaAPI from "../api/salasApi";

type RegistrarLimpezaRouteProp = RouteProp<RootStackParamList, "RegistrarLimpeza">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "RegistrarLimpeza">;

export default function RegistrarLimpezaScreen() {
  const route = useRoute<RegistrarLimpezaRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { salaId } = route.params;

  const [observacao, setObservacao] = useState("");
  const [funcionario, setFuncionario] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão negada", "Autorize o uso da câmera para continuar.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleRegistrar = async () => {
  if (!foto) {
    Alert.alert("Erro", "Tire ao menos uma foto para comprovação.");
    return;
  }

  try {
    setLoading(true);
    // Iniciar limpeza
    const limpeza = await SalaAPI.iniciarLimpeza(salaId, observacao);

    // Enviar foto vinculada à limpeza criada
    // await SalaAPI.enviarFotoLimpeza(limpeza.id, foto);

    Alert.alert(
      "Sucesso",
      "Limpeza registrada e foto enviada. Agora conclua pela tela de detalhes.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  } catch (error: any) {
    console.error("Erro ao registrar limpeza:", error.response?.data || error.message);
    Alert.alert(
      "Erro",
      error.response?.data?.detail ||
        "Não foi possível registrar a limpeza. Tente novamente."
    );
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

      <Text style={styles.label}>Foto da Limpeza</Text>
      <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
        <Text style={styles.photoButtonText}>{foto ? "Alterar Foto" : "Tirar Foto"}</Text>
      </TouchableOpacity>

      {foto && <Image source={{ uri: foto }} style={styles.photoPreview} />}

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
  container: { flex: 1, backgroundColor: "#F4F6F9", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 8 },
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
  buttonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  photoButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  photoButtonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
    resizeMode: "cover",
  },
});
