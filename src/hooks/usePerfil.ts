import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import api from "../api/api";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { UserData } from "../context/AuthContext";

// Interface local para uso no hook
interface LocalProfile extends UserData {
  avatar: string | null;
}

export function useProfileManager() {
  const auth = useAuth();
  const [user, setUser] = useState<LocalProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);

  // Rascunhos para edição
  const [draftNome, setDraftNome] = useState<string>("");
  const [draftAvatarUri, setDraftAvatarUri] = useState<string | null>(null);

  // Parse do usuário retornado da API
  const parseUserData = (data: UserData): LocalProfile => {
    const avatar: string | null = data.profile?.profile_picture ?? null;
    const nome: string | null = data.nome ?? null;
    return { ...data, avatar, nome };
  };

  // Carregar perfil do usuário
  const carregarPerfil = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<UserData>("/accounts/current_user/");
      const parsedUser = parseUserData(response.data);
      setUser(parsedUser);
      setDraftNome(parsedUser.nome ?? "");
      setDraftAvatarUri(parsedUser.avatar);
    } catch (err: any) {
      console.error("Erro ao carregar perfil:", err);
      Alert.alert(
        "Erro",
        "Não foi possível carregar o perfil. Verifique sua conexão."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  // Abrir galeria para escolher imagem
  const escolherImagem = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "É necessário permitir acesso à galeria."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setDraftAvatarUri(result.assets[0].uri);
    }
  };

  // Salvar alterações
  const salvarPerfil = async () => {
    if (!user) return;
    setIsSaving(true);

    const formData = new FormData();
    formData.append("nome", draftNome);

    if (draftAvatarUri && draftAvatarUri !== user.avatar) {
      const filename = draftAvatarUri.split("/").pop() || "avatar.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append("profile_picture", {
        uri: draftAvatarUri,
        name: filename,
        type,
      } as any);
    }

    try {
      const response = await api.patch<UserData>("/accounts/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedUser = parseUserData(response.data);
      setUser(updatedUser);
      setEditing(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditing(false);
    setDraftNome(user?.nome ?? "");
    setDraftAvatarUri(user?.avatar ?? null);
  };

  return {
    user,
    loading,
    isSaving,
    editing,
    setEditing,
    draftNome,
    setDraftNome,
    draftAvatarUri,
    escolherImagem,
    salvarPerfil,
    cancelarEdicao,
  };
}
