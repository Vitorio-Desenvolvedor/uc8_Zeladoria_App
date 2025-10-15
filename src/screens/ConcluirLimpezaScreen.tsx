import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../routes/types";
import SalaAPI from "../api/salasApi";

type ConcluirLimpezaRouteProp = RouteProp<RootStackParamList, "ConcluirLimpeza">;

export default function ConcluirLimpezaScreen() {
  const route = useRoute<ConcluirLimpezaRouteProp>();
  const navigation = useNavigation();
  const { salaId, onSuccess } = route.params;

  const [observacao, setObservacao] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selecionarFoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão negada", "É necessário permitir acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const concluirLimpeza = async () => {
    try {
      setLoading(true);

      // Cria formData para envio da foto + observação
      const formData = new FormData();
      formData.append("observacoes", observacao);
      if (foto) {
        formData.append("imagem", {
          uri: foto,
          type: "image/jpeg",
          name: "limpeza.jpg",
        } as any);
      }

      // Chama a função correta do SalaAPI
      await SalaAPI.iniciarLimpeza(salaId, observacao, "Funcionário", foto);

      Alert.alert("Sucesso", "Limpeza registrada com sucesso!");
      if (onSuccess) onSuccess();
      navigation.goBack();
    } catch (error: any) {
      console.error("Erro ao concluir limpeza:", error.response?.data || error.message);
      Alert.alert("Erro", "Falha ao concluir a limpeza.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalizar Limpeza</Text>

      <Text style={styles.label}>Observação:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: limpeza finalizada, tudo em ordem."
        multiline
        value={observacao}
        onChangeText={setObservacao}
      />

      <TouchableOpacity style={styles.fotoBtn} onPress={selecionarFoto}>
        <Text style={styles.fotoBtnText}>
          {foto ? "Alterar Foto" : "Tirar Foto"}
        </Text>
      </TouchableOpacity>

      {foto && <Image source={{ uri: foto }} style={styles.preview} />}

      {loading ? (
        <ActivityIndicator size="large" color="#004A8D" />
      ) : (
        <TouchableOpacity style={styles.submitBtn} onPress={concluirLimpeza}>
          <Text style={styles.submitText}>Concluir Limpeza</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F7",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: { fontWeight: "bold", color: "#333", marginBottom: 5 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: "top",
  },
  fotoBtn: {
    backgroundColor: "#D6EAF8",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  fotoBtnText: { color: "#004A8D", fontWeight: "bold" },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 15,
  },
  submitBtn: {
    backgroundColor: "#117A65",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "bold" },
});
