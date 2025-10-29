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
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SalaAPI from "../api/salasApi";
import { RootStackParamList } from "../routes/types"; // ✅ importa os tipos corretos

export default function ConcluirLimpezaScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "ConcluirLimpeza">>();
  const navigation = useNavigation();
  const { salaId, registroId } = route.params; // ✅ agora funciona corretamente

  const [observacoes, setObservacoes] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Escolher foto da galeria
  const escolherFotoGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Ative o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setFoto(result.assets[0].uri);
    }
  };

  // Tirar foto com câmera
  const tirarFotoCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Ative o acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setFoto(result.assets[0].uri);
    }
  };

  // Remover foto
  const removerFoto = () => setFoto(null);

  // ✅ Função para concluir limpeza
  const concluirLimpeza = async () => {
    if (!foto) {
      Alert.alert("Erro", "Você precisa tirar ou escolher uma foto!");
      return;
    }

    if (!registroId) {
      Alert.alert("Erro", "ID do registro não encontrado!");
      return;
    }

    setLoading(true);
    try {
      console.log("📸 Enviando foto...");
      await SalaAPI.enviarFotoLimpeza(registroId, foto);

      console.log("🧼 Concluindo limpeza...");
      await SalaAPI.concluirLimpeza(salaId, observacoes);

      Alert.alert("✅ Sucesso", "Limpeza concluída com sucesso!");
      navigation.goBack();
    } catch (error: any) {
      console.error("Erro ao concluir limpeza:", error.response?.data || error.message);
      Alert.alert(
        "Erro",
        error.response?.data?.detail || "Não foi possível concluir a limpeza. Tente novamente."
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

      {/* Área de imagem */}
      <View style={styles.imageContainer}>
        {foto ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: foto }} style={styles.preview} />
            <TouchableOpacity style={styles.removeButton} onPress={removerFoto}>
              <Ionicons name="close-circle" size={30} color="#ff5252" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.imagePlaceholder} onPress={escolherFotoGaleria}>
            <Ionicons name="camera" size={40} color="#999" />
            <Text style={styles.placeholderText}>Toque para adicionar foto</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={tirarFotoCamera}>
          <Ionicons name="camera-outline" size={20} color="#0277bd" />
          <Text style={styles.actionText}>Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={escolherFotoGaleria}>
          <Ionicons name="image-outline" size={20} color="#0277bd" />
          <Text style={styles.actionText}>Galeria</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#004A8D" style={{ marginTop: 10 }} />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={concluirLimpeza}>
          <Text style={styles.saveButtonText}>Marcar como Limpa</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// 🧾 Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#004A8D" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },

  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },

  placeholderText: {
    color: "#999",
    marginTop: 8,
    fontSize: 14,
  },

  previewContainer: {
    position: "relative",
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
  },

  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 15,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  actionText: { color: "#0277bd", fontWeight: "bold", marginLeft: 6 },

  saveButton: {
    backgroundColor: "#004A8D",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  saveButtonText: { color: "#fff", fontWeight: "bold" },
});
