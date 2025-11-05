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
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SalaAPI from "../api/salasApi";
import { RootStackParamList } from "../routes/types";

export default function ConcluirLimpezaScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "ConcluirLimpeza">>();
  const navigation = useNavigation();
  const { salaId, registroId } = route.params;

  const [observacoes, setObservacoes] = useState("");
  const [foto1, setFoto1] = useState<string | null>(null);
  const [foto2, setFoto2] = useState<string | null>(null);
  const [foto3, setFoto3] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Função genérica para escolher foto da galeria
  const escolherFotoGaleria = async (setFoto: React.Dispatch<React.SetStateAction<string | null>>) => {
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

  // Função genérica para tirar foto
  const tirarFotoCamera = async (setFoto: React.Dispatch<React.SetStateAction<string | null>>) => {
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

  const concluirLimpeza = async () => {
    if (!foto1 && !foto2 && !foto3) {
      Alert.alert("Erro", "Envie pelo menos uma foto!");
      return;
    }

    if (!registroId) {
      Alert.alert("Erro", "ID do registro não encontrado!");
      return;
    }

    setLoading(true);
    try {
      console.log("📸 Enviando fotos...");
      if (foto1) await SalaAPI.enviarFotoLimpeza(registroId, foto1);
      if (foto2) await SalaAPI.enviarFotoLimpeza(registroId, foto2);
      if (foto3) await SalaAPI.enviarFotoLimpeza(registroId, foto3);

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

  // Função para renderizar cada campo de foto
  const renderCampoFoto = (foto: string | null, setFoto: any, label: string) => (
    <View style={styles.fotoSection}>
      <Text style={styles.fotoLabel}>{label}</Text>
      {foto ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: foto }} style={styles.preview} />
          <TouchableOpacity style={styles.removeButton} onPress={() => setFoto(null)}>
            <Ionicons name="close-circle" size={30} color="#ff5252" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.imagePlaceholder}
          onPress={() => escolherFotoGaleria(setFoto)}
        >
          <Ionicons name="camera" size={40} color="#999" />
          <Text style={styles.placeholderText}>Toque para adicionar foto</Text>
        </TouchableOpacity>
      )}

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => tirarFotoCamera(setFoto)}>
          <Ionicons name="camera-outline" size={20} color="#0277bd" />
          <Text style={styles.actionText}>Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => escolherFotoGaleria(setFoto)}>
          <Ionicons name="image-outline" size={20} color="#0277bd" />
          <Text style={styles.actionText}>Galeria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Concluir Limpeza</Text>

      <TextInput
        placeholder="Observações (opcional)"
        value={observacoes}
        onChangeText={setObservacoes}
        style={styles.input}
        multiline
      />

      {renderCampoFoto(foto1, setFoto1, "Foto 1")}
      {renderCampoFoto(foto2, setFoto2, "Foto 2")}
      {renderCampoFoto(foto3, setFoto3, "Foto 3")}

      {loading ? (
        <ActivityIndicator size="large" color="#004A8D" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={concluirLimpeza}>
          <Text style={styles.saveButtonText}>Marcar como Limpa</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#004A8D", textAlign: "center" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },

  fotoSection: { marginBottom: 25 },
  fotoLabel: { fontWeight: "bold", fontSize: 16, color: "#004A8D", marginBottom: 8 },

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

  placeholderText: { color: "#999", marginTop: 8, fontSize: 14 },

  previewContainer: {
    position: "relative",
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
  },

  preview: { width: "100%", height: "100%", borderRadius: 12 },

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
    marginTop: 8,
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

  actionText: { color: "#004A8D", fontWeight: "bold", marginLeft: 6 },

  saveButton: {
    backgroundColor: "#004A8D",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
