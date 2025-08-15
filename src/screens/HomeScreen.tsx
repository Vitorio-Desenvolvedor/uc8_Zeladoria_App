import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getRole = async () => {
      const role = await AsyncStorage.getItem("user_role");
      setIsAdmin(role === "admin");
    };
    getRole();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Histórico de Limpezas" onPress={() => navigation.navigate("Historico" as never)} />
      {isAdmin && (
        <Button title="Administração de Salas" onPress={() => navigation.navigate("Admin" as never)} />
      )}
      <Button title="Logout" onPress={async () => {
        await AsyncStorage.clear();
        navigation.navigate("Login" as never);
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 }
});
