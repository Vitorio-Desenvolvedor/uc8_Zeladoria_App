import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList, Sala } from "../routes/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SalaAPI from "../api/salasApi";

type FormEditSalaRouteProp = RouteProp<RootStackParamList, "FormEditSala">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "FormEditSala">;

export default function FormEditSalaScreen() {
  const route = useRoute<FormEditSalaRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { salaId } = route.params;

  const [nome, setNome] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSala, setLoadingSala] = useState(true);

  // Buscar dados da sala ao montar o componente
  useEffect(() => {
    const fetchSala = async () => {
      try {
        setLoadingSala(true);
        const sala: Sala = await SalaAPI.getSalaById(salaId);

        setNome(sala.nome_numero);
        setCapacidade(sala.capacidade ? String(sala.capacidade) : "");
        setLocalizacao(sala.localizacao ?? "");
        setDescricao(sala.descricao ?? "");
      } catch (error) {
        console.error("Erro ao obter sala:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados da sala.");
        navigation.goBack();
      } finally {
        setLoadingSala(false);
      }
    };
    fetchSala();
  }, [salaId]);

  // Atualizar sala
  const handleUpdate = async () => {
    if (!nome || !localizacao) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      const payload: Partial<Sala> = {
        nome_numero: nome,
        capacidade: capacidade ? parseInt(capacidade, 10) : undefined,
        localizacao,
        descricao,
      };

      await SalaAPI.updateSala(salaId, payload as any);
      Alert.alert("Sucesso", "Sala atualizada com sucesso!");
      navigation.goBack();
    } catch (error: any) {
      console.error(
        "Erro ao atualizar sala:",
        error.response?.data || error.message || error
      );
      Alert.alert("Erro", "Não foi possível atualizar a sala.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingSala) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#004A8D" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Editar Sala</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome ou Número da Sala"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Capacidade"
        value={capacidade}
        keyboardType="numeric"
        onChangeText={setCapacidade}
      />
      <TextInput
        style={styles.input}
        placeholder="Localização"
        value={localizacao}
        onChangeText={setLocalizacao}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#aaa" }]}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F6F9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
