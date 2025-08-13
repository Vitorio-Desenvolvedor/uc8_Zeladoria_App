import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [salas, setSalas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://192.168.15.3:8000/salas/', {
          headers: { Authorization: `Token ${token}` },
        });
        setSalas(response.data);
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
        Alert.alert('Erro', 'Não foi possível carregar as salas.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalas();
  }, []);

  const abrirDetalhesSala = (id: number) => {
    navigation.navigate('DetalhesSala', { salaId: id });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salas</Text>
      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.salaItem}
            onPress={() => abrirDetalhesSala(item.id)}
          >
            <Text style={styles.salaNome}>{item.nome}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  salaItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
  },
  salaNome: { fontSize: 18, fontWeight: 'bold' },
});
