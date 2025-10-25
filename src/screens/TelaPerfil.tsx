import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { AuthContextType } from "../routes/types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";
import api from "../api/api"; // Ajuste para o caminho correto

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "TelaPerfil">;

export default function TelaPerfil() {
  const auth = useAuth() as AuthContextType;
  const navigation = useNavigation<NavigationProp>();

  const [nome, setNome] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Carregar perfil
  const fetchPerfil = async () => {
    if (!auth.token) return;
    setLoading(true);
    try {
      const response = await api.get("/accounts/profile/", {
        headers: { Authorization: `Token ${auth.token}` },
      });
      setNome(response.data.nome || "");
      setAvatar(response.data.profile_picture || null);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  // 🔹 Selecionar imagem do dispositivo
  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // 🔹 Salvar alterações
  const salvarPerfil = async () => {
    if (!auth.token) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nome", nome);
      if (avatar && avatar.startsWith("file://")) {
        const uriParts = avatar.split("/");
        const name = uriParts[uriParts.length - 1];
        const file: any = {
          uri: avatar,
          name,
          type: "image/jpeg",
        };
        formData.append("profile_picture", file);
      }

      await api.put("/accounts/profile/", formData, {
        headers: {
          Authorization: `Token ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      fetchPerfil();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Avatar */}
        <TouchableOpacity onPress={escolherImagem} style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={120} color="#004A8D" />
          )}
        </TouchableOpacity>
        <Text style={styles.info}>Toque na imagem para alterar</Text>

        {/* Nome */}
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
        />

        {/* Botão salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={salvarPerfil}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={28} color="#fff" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={auth.logout}>
          <Ionicons name="log-out" size={28} color="#ff4d4d" />
          <Text style={[styles.footerLabel, { color: "#ff4d4d" }]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5", justifyContent: "space-between" },
  card: { flex: 1, alignItems: "center", padding: 20 },
  avatarContainer: { marginBottom: 10 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: "#004A8D" },
  info: { fontSize: 14, color: "#555", marginBottom: 15 },
  label: { alignSelf: "flex-start", fontWeight: "bold", marginBottom: 5, fontSize: 16, color: "#333" },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#004A8D",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#004A8D",
    paddingVertical: 12,
    paddingBottom: 25,
  },
  footerButton: { flexDirection: "column", alignItems: "center" },
  footerLabel: { fontSize: 12, marginTop: 3, color: "#fff" },
});
