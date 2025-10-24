import React from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { useNotificacoes } from "../hooks/useNotificacoes";

export default function NotificacoesScreen() {
  const {
    notificacoes,
    loading,
    error,
    marcarComoLida,
    marcarTodasComoLidas,
  } = useNotificacoes();

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Marcar todas como lidas" onPress={marcarTodasComoLidas} />
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              marginVertical: 5,
              backgroundColor: item.lida ? "#D3D3D3" : "#FFF",
              borderRadius: 10,
            }}
            onPress={() => marcarComoLida(item.id)}
          >
            <Text style={{ fontWeight: item.lida ? "normal" : "bold" }}>
              {item.mensagem}
            </Text>
            <Text style={{ fontSize: 12, color: "#555" }}>
              {new Date(item.data_criacao).toLocaleString()}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
