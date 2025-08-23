import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }: any) {
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Bem-vindo, {user?.username}
      </Text>

      <Button title="Salas" onPress={() => navigation.navigate("Salas")} />
      <Button title="Histórico" onPress={() => navigation.navigate("Historico")} />
      {user?.is_staff && (
        <Button title="Administração" onPress={() => navigation.navigate("Admin")} />
      )}
      <Button title="Sair" color="red" onPress={signOut} />
    </View>
  );
}
