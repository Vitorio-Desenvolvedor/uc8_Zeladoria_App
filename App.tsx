import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

function AppWrapper() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Routes />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
}
