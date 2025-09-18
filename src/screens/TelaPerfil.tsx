import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { AuthContextType } from "../routes/types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "TelaPerfil">;

export default function TelaPerfil() {
  const auth = useAuth() as AuthContextType;
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Foto / Avatar */}
        <View style={styles.avatarContainer}>
          {auth.user?.avatar ? (
            <Image source={{ uri: auth.user.avatar }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={100} color="#004A8D" />
          )}
        </View>

        {/* Informações do usuário */}
        <Text style={styles.titulo}>Perfil do Usuário</Text>
        {auth.user ? (
          <>
            <Text style={styles.info}>👤 Usuário: {auth.user.username}</Text>
            <Text style={styles.info}>
              📧 Email: {auth.user.email || "Não informado"}
            </Text>
          </>
        ) : (
          <Text style={styles.info}>Nenhum usuário logado</Text>
        )}
      </View>

      {/* Footer fixo */}
      <View style={styles.footer}>
        {/* Botão Home */}
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={28} color="#fff" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>

        {/* Botão Sair */}
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
  avatarContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#004A8D",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
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
