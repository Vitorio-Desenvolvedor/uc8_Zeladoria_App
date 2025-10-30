import React, { useState } from "react";
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
import { RootStackParamList } from "../routes/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SalaAPI from "../api/salasApi";
import { Ionicons } from "@expo/vector-icons";

type FormSalaRouteProp = RouteProp<RootStackParamList, "FormSala">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "FormSala">;

export default function FormSalaScreen() {
  const route = useRoute<FormSalaRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const onSalaCriada = route.params?.onSalaCriada;

  const [nomeNumero, setNomeNumero] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados de erro para os campos obrigatórios
  const [erroNome, setErroNome] = useState(false);
  const [erroCapacidade, setErroCapacidade] = useState(false);
  const [erroLocalizacao, setErroLocalizacao] = useState(false);

  const handleCreate = async () => {
    let hasError = false;

    // Validação dos campos obrigatórios
    if (!nomeNumero.trim()) {
      setErroNome(true);
      hasError = true;
    } else {
      setErroNome(false);
    }

    if (!capacidade.trim()) {
      setErroCapacidade(true);
      hasError = true;
    } else {
      setErroCapacidade(false);
    }

    if (!localizacao.trim()) {
      setErroLocalizacao(true);
      hasError = true;
    } else {
      setErroLocalizacao(false);
    }

    if (hasError) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        nome_numero: nomeNumero,
        capacidade: parseInt(capacidade, 10),
        localizacao,
        descricao: descricao || undefined,
      };

      const novaSala = await SalaAPI.createSala(payload as any);

      Alert.alert("Sucesso", "Sala criada com sucesso!");

      if (typeof onSalaCriada === "function") {
        try {
          await onSalaCriada();
        } catch {}
      }

      navigation.goBack();
    } catch (error: any) {
      console.error(
        "Erro ao criar sala:",
        error.response?.data || error.message || error
      );
      Alert.alert("Erro", "Não foi possível criar a sala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Text style={styles.title}>Criar Nova Sala</Text>

      {/* Campo Nome/Número */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, erroNome && { borderColor: "#FF7F00" }]}
          placeholder="Nome ou Número *"
          value={nomeNumero}
          onChangeText={setNomeNumero}
        />
        {erroNome && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={16} color="#FF7F00" />
            <Text style={styles.errorText}>Campo obrigatório</Text>
          </View>
        )}
      </View>

      {/* Campo Capacidade */}
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

      {/* Campo Localização */}
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

      {/* Campo Descrição */}
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição (opcional)"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      {loading ? (
        <ActivityIndicator size="large" color="#004A8D" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreate}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Criar Sala</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F6F9",
  },
  title: {
    fontSize: 22,
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
    borderRadius: 10,
    padding: 14,
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
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#004A8D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});
