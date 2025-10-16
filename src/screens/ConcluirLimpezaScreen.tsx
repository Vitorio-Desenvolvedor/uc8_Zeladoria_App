import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../routes/types";
import SalaAPI from "../api/salasApi";

type ConcluirLimpezaRouteProp = RouteProp<RootStackParamList, "ConcluirLimpeza">;

export default function ConcluirLimpezaScreen() {
  const route = useRoute<ConcluirLimpezaRouteProp>();
  const navigation = useNavigation();
  const { salaId } = route.params;

  const [observacoes, setObservacoes] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Escolher foto da galeria 
  const escolherFotoGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Habilite o acesso à galeria para selecionar fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setFoto(result.assets[0].uri);
    }
  };

  // Tirar foto com a câmera
  const tirarFotoCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Habilite o acesso à câmera para tirar fotos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setFoto(result.assets[0].uri);
    }
  };

  // Concluir limpeza 
  const concluirLimpeza = async () => {
    if (!foto) {
      Alert.alert("Erro", "Você precisa enviar pelo menos uma foto!");
      return;
    }

    setLoading(true);

    try {
      // Envia dados de conclusão
      const response = await SalaAPI.concluirLimpeza(salaId, observacoes);

      // Envia a foto separadamente
      await SalaAPI.enviarFotoLimpeza(response.id ?? salaId, foto);

      Alert.alert("Sucesso", "Limpeza concluída e sala marcada como limpa!");
      navigation.goBack();
    } catch (error: any) {
      console.error("Erro ao concluir limpeza:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.detail ||
          "Não foi possível concluir a limpeza. Verifique os dados enviados."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Concluir Limpeza</Text>

      <TextInput
        placeholder="Observações (opcional)"
        value={observacoes}
        onChangeText={setObservacoes}
        style={styles.input}
        multiline
      />

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={tirarFotoCamera}>
          <Text style={styles.actionText}>Tirar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={escolherFotoGaleria}>
          <Text style={styles.actionText}>Galeria</Text>
        </TouchableOpacity>
      </View>

      {foto && <Image source={{ uri: foto }} style={styles.preview} />}

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={concluirLimpeza}>
          <Text style={styles.saveButtonText}>Marcar como Limpa</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// === Estilos ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 25,
    borderRadius: 15,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#e3f2fd",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  actionText: {
    color: "#0277bd",
    fontWeight: "bold",
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
