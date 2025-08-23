import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

export default function LoginScreen({
  onLogin,
}: {
  onLogin?: (email: string, senha: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        secureTextEntry
        onChangeText={setSenha}
        style={styles.input}
      />
      <Button
        title="Entrar"
        onPress={() => {
          if (onLogin) {
            onLogin(email, senha);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
