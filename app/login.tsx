import { View, Text, Button, TextInput } from "react-native";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { router } from "expo-router";

export default function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return router.replace("/(protected)/home");

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(protected)/home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Login</Text>
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => router.push("/register")} />
    </View>
  );
}
