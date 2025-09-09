import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {user?.username}!</Text>

      {/* 🔹 Botões principais */}
      <View style={styles.mainButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Salas")}
        >
          <Text style={styles.buttonText}>Ver Salas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("RegistrarLimpeza")}
        >
          <Text style={styles.buttonText}>Registrar Limpeza</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Historico")}
        >
          <Text style={styles.buttonText}>Histórico de Limpezas</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Rodapé fixo */}
      <View style={styles.footer}>
        {/* Botão Perfil */}
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: "#003366" }]}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Text style={styles.footerText}>Perfil</Text>
        </TouchableOpacity>

        {/* Botão Administrativo */}
        {(user?.is_staff || user?.is_superuser) && (
          <TouchableOpacity
            style={[styles.footerButton, { backgroundColor: "#ff9800" }]}
            onPress={() => navigation.navigate("AdminSalas")}
          >
            <Text style={styles.footerText}>Administração</Text>
          </TouchableOpacity>
        )}

        {/* Botão Logout */}
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: "#dc3545" }]}
          onPress={logout}
        >
          <Text style={styles.footerText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 20, textAlign: "center" },

  mainButtons: { flex: 1, justifyContent: "center", alignItems: "center" },

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  footerText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
