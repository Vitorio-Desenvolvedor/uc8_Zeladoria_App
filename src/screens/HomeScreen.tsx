import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";
import { Ionicons } from "@expo/vector-icons";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
type HomeScreenRouteProp = RouteProp<RootStackParamList, keyof RootStackParamList>;

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();

  const [selectedTopButton, setSelectedTopButton] = useState<"Salas" | "RegistrarLimpeza" | "HistoricoLimpezas" | null>(null);

  const getFooterColor = (screenName: keyof RootStackParamList) =>
    route.name === screenName ? "#FFD700" : "#fff";

  const getTopButtonColor = (buttonName: "Salas" | "RegistrarLimpeza" | "HistoricoLimpezas") =>
    selectedTopButton === buttonName ? "#004A8D" : "#555";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Bem-vindo</Text>
      </View>

      {/* Botões principais (topo) */}
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => {
            setSelectedTopButton("Salas");
            navigation.navigate("Salas");
          }}
        >
          <Ionicons name="business" size={28} color={getTopButtonColor("Salas")} />
          <Text style={[styles.topButtonLabel, { color: getTopButtonColor("Salas") }]}>Ver Salas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.topButton}
          onPress={() => {
            setSelectedTopButton("RegistrarLimpeza");
            navigation.navigate("RegistrarLimpeza");
          }}
        >
          <Ionicons name="checkmark-done" size={28} color={getTopButtonColor("RegistrarLimpeza")} />
          <Text style={[styles.topButtonLabel, { color: getTopButtonColor("RegistrarLimpeza") }]}>
            Registrar Limpeza
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.topButton}
          onPress={() => {
            setSelectedTopButton("HistoricoLimpezas");
            navigation.navigate("HistoricoLimpezas");
          }}
        >
          <Ionicons name="time" size={28} color={getTopButtonColor("HistoricoLimpezas")} />
          <Text style={[styles.topButtonLabel, { color: getTopButtonColor("HistoricoLimpezas") }]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      {/* Espaço central */}
      <View style={styles.centerContent}>
        <Text style={styles.centerText}>
          Escolha uma opção acima para continuar.
        </Text>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        {/* Home */}
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={28} color={getFooterColor("Home")} />
          <Text style={[styles.footerLabel, { color: getFooterColor("Home") }]}>Home</Text>
        </TouchableOpacity>

        {/* Perfil */}
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("TelaPerfil")}
        >
          <Ionicons name="person-circle" size={28} color={getFooterColor("TelaPerfil")} />
          <Text style={[styles.footerLabel, { color: getFooterColor("TelaPerfil") }]}>Perfil</Text>
        </TouchableOpacity>

        {/* Administração */}
        {user?.is_staff && (
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("AdminSalas")}
          >
            <Ionicons name="settings" size={28} color={getFooterColor("AdminSalas")} />
            <Text style={[styles.footerLabel, { color: getFooterColor("AdminSalas") }]}>
              Admin
            </Text>
          </TouchableOpacity>
        )}

        {/* Sair */}
        <TouchableOpacity style={styles.footerButton} onPress={logout}>
          <Ionicons name="log-out" size={28} color="#E53935" />
          <Text style={[styles.footerLabel, { color: "#E53935" }]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },
  header: { backgroundColor: "#004A8D", padding: 20, alignItems: "center" },
  headerText: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  topButton: { flexDirection: "column", alignItems: "center" },
  topButtonLabel: { fontSize: 12, marginTop: 5, fontWeight: "bold" },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerText: { fontSize: 16, color: "#555", textAlign: "center", paddingHorizontal: 20 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#004A8D",
    paddingVertical: 10,
    paddingBottom: 25,
  },
  footerButton: { flexDirection: "column", alignItems: "center" },
  footerLabel: { fontSize: 12, marginTop: 3 },
});
