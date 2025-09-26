import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native"; // inativo
import { Ionicons } from "@expo/vector-icons"; // Ícones

export default function LoginScreen() {
  const { login, loading, error, user } = useAuth();
  // const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Atenção", "Preencha usuário e senha.");
      return;
    }
    await login(username, password);

  //   if (user) {
  //     // navigation.reset({
  //       index: 0,
  //       routes: [{ name: "Home" as never }],
  //     });
  //   }
   };

  return (
    <ImageBackground
      source={{ uri: "https://api.rn.senac.br/api/Arquivo/Download/227" }}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.titulo}>Zeladoria-Senac</Text>
          <Text style={styles.subtitulo}>Faça login para continuar</Text>

          {/* Input usuário */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Usuário"
              placeholderTextColor="#ddd"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Input senha */}
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#ddd"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error && <Text style={[styles.subtitulo, { color: "red" }]}>{error}</Text>}

          {/* Botão login */}
          <TouchableOpacity
            style={[styles.botao, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBotao}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Link esqueci senha */}
          <TouchableOpacity onPress={() => Alert.alert("Recuperar senha", "Funcionalidade em desenvolvimento")}> 
            <Text style={styles.link}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 14,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginBottom: 20,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#fff", paddingVertical: 8, fontSize: 16 },
  botao: {
    backgroundColor: "#004A8D", // azul Senac botão login
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  textoBotao: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { color: "#1E90FF", textAlign: "center", fontSize: 14, marginTop: 5 },
});
