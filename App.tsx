import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import Routes from "./src/routes";
import { SafeAreaProvider } from 'react-native-safe-area-context'


export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
