import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }: any) {
  const { user, signOut, refreshMe } = useAuth();

  useEffect(() => {
    refreshMe(); // garante dados atualizados
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo, {user?.username}!</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Registrar Limpeza"
          onPress={() => navigation.navigate("RegistroLimpeza")}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Histórico de Limpezas"
          onPress={() => navigation.navigate("HistoricoLimpezas")}
        />
      </View>

      {user?.is_staff && (
        <View style={styles.buttonContainer}>
          <Button
            title="Administração de Salas"
            onPress={() => navigation.navigate("AdminSalas")}
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Sair" color="red" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  welcome: { fontSize: 20, fontWeight: "bold", marginBottom: 30 },
  buttonContainer: { marginVertical: 8, width: "80%" },
});
