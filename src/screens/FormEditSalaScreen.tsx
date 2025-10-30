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
import { Ionicons } from "@expo/vector-icons";

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

  const [erroNome, setErroNome] = useState(false);
  const [erroCapacidade, setErroCapacidade] = useState(false);
  const [erroLocalizacao, setErroLocalizacao] = useState(false);

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

  const handleUpdate = async () => {
    let hasError = false;

    if (!nome.trim()) {
      setErroNome(true);
      hasError = true;
    } else setErroNome(false);

    if (!capacidade.trim()) {
      setErroCapacidade(true);
      hasError = true;
    } else setErroCapacidade(false);

    if (!localizacao.trim()) {
      setErroLocalizacao(true);
      hasError = true;
    } else setErroLocalizacao(false);

    if (hasError) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<Sala> = {
        nome_numero: nome,
        capacidade: parseInt(capacidade, 10),
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
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Text style={styles.title}>Editar Sala</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, erroNome && { borderColor: "#FF7F00" }]}
          placeholder="Nome ou Número da Sala *"
          value={nome}
          onChangeText={setNome}
        />
        {erroNome && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={16} color="#FF7F00" />
            <Text style={styles.errorText}>Campo obrigatório</Text>
          </View>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, erroCapacidade && { borderColor: "#FF7F00" }]}
          placeholder="Capacidade *"
          keyboardType="numeric"
          value={capacidade}
          onChangeText={setCapacidade}
        />
        {erroCapacidade && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={16} color="#FF7F00" />
            <Text style={styles.errorText}>Campo obrigatório</Text>
          </View>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, erroLocalizacao && { borderColor: "#FF7F00" }]}
          placeholder="Localização *"
          value={localizacao}
          onChangeText={setLocalizacao}
        />
        {erroLocalizacao && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={16} color="#FF7F00" />
            <Text style={styles.errorText}>Campo obrigatório</Text>
          </View>
        )}
      </View>

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição (opcional)"
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
    color: "#004A8D",
    textAlign: "center",
  },
  inputWrapper: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  errorText: {
    color: "#FF7F00",
    marginLeft: 5,
    fontSize: 13,
  },
  button: {
    backgroundColor: "#004A8D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
