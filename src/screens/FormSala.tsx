import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";
import SalaAPI from "../api/salasApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "FormSala">;

export default function FormSala() {
  const navigation = useNavigation<NavigationProp>();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const salvarSala = async () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O campo Nome/Numero é obrigatório.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome_numero", nome);
      formData.append("descricao", descricao);
      formData.append("capacidade", capacidade);
      formData.append("localizacao", localizacao);

      if (imagem) {
        const file = {
          uri: imagem,
          type: "image/jpeg",
          name: "sala.jpg",
        } as any;
        formData.append("imagem", file);
      }

      await SalaAPI.createSala(formData);

      Alert.alert("Sucesso", "Sala criada com sucesso!");
      navigation.goBack();
    } catch (error: any) {
      console.error("Erro ao criar sala:", error.message || error);
      Alert.alert("Erro", "Não foi possível criar a sala.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome/Número</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: Sala 101"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex: Sala de Reuniões"
      />

      <Text style={styles.label}>Capacidade</Text>
      <TextInput
        style={styles.input}
        value={capacidade}
        onChangeText={setCapacidade}
        keyboardType="numeric"
        placeholder="Ex: 30"
      />

      <Text style={styles.label}>Localização</Text>
      <TextInput
        style={styles.input}
        value={localizacao}
        onChangeText={setLocalizacao}
        placeholder="Ex: Bloco A, 2º andar"
      />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={{ color: "#004A8D" }}>
          {imagem ? "Trocar imagem" : "Selecionar imagem"}
        </Text>
      </TouchableOpacity>

      {imagem && <Image source={{ uri: imagem }} style={styles.preview} />}

      <TouchableOpacity style={styles.saveButton} onPress={salvarSala}>
        <Text style={styles.saveText}>Salvar Sala</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F4F6F9" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 15, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  imagePicker: {
    marginTop: 15,
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#004A8D",
    borderRadius: 8,
    backgroundColor: "rgba(0,74,141,0.05)",
  },
  preview: { width: "100%", height: 180, borderRadius: 8, marginTop: 10 },
  saveButton: {
    backgroundColor: "#004A8D",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
