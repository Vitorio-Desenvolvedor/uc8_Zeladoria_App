import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import Routes from "./src/routes/index"; 

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
