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
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { AuthContextType, UserData } from "../routes/types";
import api from "../api/api";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TelaPerfil"
>;

export default function TelaPerfil() {
  const auth = useAuth() as AuthContextType;
  const navigation = useNavigation<NavigationProp>();

  const [user, setUser] = useState<UserData | null>(auth.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [nome, setNome] = useState<string>(user?.nome || "");
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar || null);

  // Carregar perfil do usuário logado
  const carregarPerfil = async () => {
    setLoading(true);
    try {
      const response = await api.get<UserData>("/accounts/current_user/");
      const userData = response.data;
      const profile_picture = userData.profile?.profile_picture || null;

      setUser({ ...userData, avatar: profile_picture });
      setNome(userData.nome || "");
      setAvatarUri(profile_picture);
    } catch (err: any) {
      console.error("Erro ao carregar perfil:", err);
      Alert.alert(
        "Erro",
        "Não foi possível carregar o perfil. Verifique sua conexão."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  // Abrir galeria para escolher imagem
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

  // Salvar alterações no perfil
  const salvarPerfil = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append("nome", nome);
    if (avatarUri && avatarUri !== user.avatar) {
      const filename = avatarUri.split("/").pop() || "avatar.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append("profile_picture", {
        uri: avatarUri,
        name: filename,
        type,
      } as any);
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
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#004A8D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Perfil do Usuário</Text>

        <TouchableOpacity onPress={editing ? escolherImagem : undefined}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={120} color="#004A8D" />
          )}
        </TouchableOpacity>

        {editing ? (
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome completo"
          />
        ) : (
          <Text style={styles.info}>Nome: {user?.nome || user?.username}</Text>
        )}
        <Text style={styles.info}>Usuário: {user?.username}</Text>
        <Text style={styles.info}>Email: {user?.email || "Não informado"}</Text>

        <View style={{ flexDirection: "row", marginTop: 15 }}>
          {editing ? (
            <TouchableOpacity style={styles.saveButton} onPress={salvarPerfil}>
              <Ionicons name="save" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}
            >
              <Ionicons name="create" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

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
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#004A8D",
    marginVertical: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 250,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    textAlign: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#004A8D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#004A8D",
    paddingVertical: 12,
    paddingBottom: 25,
  },
  footerButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 12,
    marginTop: 3,
    color: "#fff",
  },
});
