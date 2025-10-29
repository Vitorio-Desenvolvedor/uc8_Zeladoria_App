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
  const [nome, setNome] = useState(user?.nome || "");
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  //  Carregar perfil
  const carregarPerfil = async () => {
    setLoading(true);
    try {
      const response = await api.get<UserData>("/accounts/current_user/");
      const data = response.data;
      const avatar = data.profile?.profile_picture || null;

      setUser({ ...data, avatar });
      setNome(data.nome || "");
      setAvatarUri(avatar);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o perfil. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  //  Escolher imagem
  const escolherImagem = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permissão necessária", "Ative o acesso à galeria nas configurações.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  //  Tirar foto
  const tirarFoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert("Permissão necessária", "Ative o acesso à câmera nas configurações.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  //  Salvar alterações
  const salvarPerfil = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append("nome", nome);

    if (avatarUri && avatarUri !== user.avatar) {
      const filename = avatarUri.split("/").pop() || "avatar.jpg";
      const ext = /\.(\w+)$/.exec(filename);
      const type = ext ? `image/${ext[1]}` : "image/jpeg";

      formData.append("profile_picture", { uri: avatarUri, name: filename, type } as any);
    }

    try {
      setLoading(true);
      const response = await api.patch("/accounts/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = response.data;
      const avatar = updated.profile?.profile_picture || avatarUri;

      // Garante que o nome não suma
      setUser((prev) => ({
        ...prev!,
        ...updated,
        nome: nome,
        avatar,
      }));

      setAvatarUri(avatar);
      setEditing(false);

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  // Tela de carregamento
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004A8D" />
      </SafeAreaView>
    );
  }

  //  Interface principal
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Meu Perfil</Text>

          {/* Avatar */}
          <TouchableOpacity onPress={editing ? escolherImagem : undefined}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle" size={130} color="#FF7F00" />
            )}
          </TouchableOpacity>

          {/* Botões de imagem */}
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

          {/* Nome */}
          {editing ? (
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome do Usuário"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.infoNome}>{nome || user?.username}</Text>
          )}

          {/* Informações */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Usuário:</Text>
            <Text style={styles.infoValue}>{user?.username}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email || "Não informado"}</Text>
          </View>

          {/* Ações */}
          <View style={styles.actionContainer}>
            {editing ? (
              <>
                <TouchableOpacity style={styles.saveButton} onPress={salvarPerfil}>
                  <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
                  <Text style={styles.saveText}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
                  <Ionicons name="close-circle-outline" size={22} color="#fff" />
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                <Ionicons name="create-outline" size={22} color="#fff" />
                <Text style={styles.editText}>Editar Perfil</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Home")}>
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
  container: { flex: 1, backgroundColor: "#e9eef5" },
  scroll: { flexGrow: 1, justifyContent: "space-between", paddingBottom: 30 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

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

  titulo: { fontSize: 22, fontWeight: "700", color: "#004A8D", marginBottom: 10 },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#FF7F00",
    marginVertical: 15,
  },

  imageButtons: { flexDirection: "row", gap: 15, marginBottom: 10 },
  imageOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef3fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  imageOptionText: { color: "#004A8D", marginLeft: 5, fontWeight: "600" },

  infoNome: { fontSize: 20, fontWeight: "600", color: "#0a0909", marginBottom: 8 },
  infoContainer: {
    width: "90%",
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 9,
  },
  infoLabel: { fontWeight: "bold", color: "#555", width: 70 },
  infoValue: { color: "#333", fontWeight: "500" },

  input: {
    borderWidth: 2,
    borderColor: "#004A8D",
    borderRadius: 8,
    padding: 10,
    width: "85%",
    textAlign: "center",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },

  actionContainer: { flexDirection: "row", justifyContent: "center", marginTop: 15, gap: 10 },
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
    backgroundColor: "#FF7F00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#777",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  editText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  saveText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  cancelText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#004A8D",
    paddingVertical: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  footerButton: { alignItems: "center" },
  footerLabel: { color: "#fff", marginTop: 4, fontSize: 13 },
});
