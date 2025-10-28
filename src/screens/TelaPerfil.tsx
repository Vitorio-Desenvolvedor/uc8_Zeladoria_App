import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import { AuthContextType, UserData, RootStackParamList } from "../routes/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "TelaPerfil">;

export default function TelaPerfil() {
  const auth = useAuth() as AuthContextType;
  const navigation = useNavigation<NavigationProp>();

  const [user, setUser] = useState<UserData | null>(auth.user);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState(user?.nome || "");
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar || null);

  // 🔹 Carregar perfil do usuário logado
  const carregarPerfil = async () => {
    setLoading(true);
    try {
      const response = await api.get<UserData>("/accounts/current_user/");
      const userData = response.data;
      const profile_picture = userData.profile?.profile_picture || null;

      setUser({ ...userData, avatar: profile_picture });
      setNome(userData.nome || "");
      setAvatarUri(profile_picture);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar o perfil. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  // Escolher imagem da galeria
  const escolherImagem = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "É necessário permitir acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  // Tirar foto com a câmera
  const tirarFoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "É necessário permitir acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  // Salvar alterações no perfil
  const salvarPerfil = async () => {
    if (!user) return;
    const formData = new FormData();
    formData.append("nome", nome);

    if (avatarUri && avatarUri !== user.avatar) {
      const filename = avatarUri.split("/").pop() || "avatar.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append("profile_picture", { uri: avatarUri, name: filename, type } as any);
    }

    try {
      setLoading(true);
      const response = await api.patch("/accounts/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = response.data;
      const profile_picture = updatedUser.profile?.profile_picture || null;
      setUser({ ...updatedUser, avatar: profile_picture });
      setAvatarUri(profile_picture);
      setEditing(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004A8D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Meu Perfil</Text>

          <TouchableOpacity onPress={editing ? escolherImagem : undefined}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle" size={130} color="#004A8D" />
            )}
          </TouchableOpacity>

          {/* Botões para alterar foto */}
          {editing && (
            <View style={styles.imageButtons}>
              <TouchableOpacity style={styles.imageOption} onPress={escolherImagem}>
                <Ionicons name="images-outline" size={18} color="#004A8D" />
                <Text style={styles.imageOptionText}>Galeria</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.imageOption} onPress={tirarFoto}>
                <Ionicons name="camera-outline" size={18} color="#004A8D" />
                <Text style={styles.imageOptionText}>Câmera</Text>
              </TouchableOpacity>
            </View>
          )}

          {editing ? (
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome completo"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.infoNome}>{user?.nome || user?.username}</Text>
          )}

          {/*  Informações mais próximas */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Usuário:</Text>
            <Text style={styles.infoValue}>{user?.username}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email || "Não informado"}</Text>
          </View>

          {/* Botões de ação */}
          <View style={styles.actionContainer}>
            {editing ? (
              <TouchableOpacity style={styles.saveButton} onPress={salvarPerfil}>
                <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
                <Text style={styles.saveText}>Salvar Alterações</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                <Ionicons name="create-outline" size={22} color="#fff" />
                <Text style={styles.editText}>Editar Perfil</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 🔸 Rodapé fixo */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="home" size={26} color="#fff" />
            <Text style={styles.footerLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerButton} onPress={auth.logout}>
            <Ionicons name="log-out-outline" size={26} color="#ff4d4d" />
            <Text style={[styles.footerLabel, { color: "#ff4d4d" }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9eef5",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  titulo: { // ajuste
    fontSize: 22,
    fontWeight: "700",
    color: "#004A8D",
    marginBottom: 10,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#FF7F00",
    marginVertical: 15,
  },
  imageButtons: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },
  imageOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef3fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  imageOptionText: {
    color: "#004A8D",
    marginLeft: 5,
    fontWeight: "600",
  },
  infoNome: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  infoContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#555",
  },
  infoValue: {
    color: "#333",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "85%",
    textAlign: "center",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#004A8D",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF7F00", // Laranja Senac
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  editText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#004A8D",
    paddingVertical: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  footerButton: {
    alignItems: "center",
  },
  footerLabel: {
    color: "#fff",
    marginTop: 4,
    fontSize: 13,
  },
});

