import { View, Text, Button, TextInput } from "react-native";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { router } from "expo-router";

export default function Register() {
  const { register, user } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return router.replace("/(protected)/home");

  const handleRegister = async () => {
    try {
      await register(email, password, username);
      router.replace("/(protected)/home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Register</Text>
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button title="Register" onPress={handleRegister} />
      <Button title="Go to Login" onPress={() => router.push("/login")} />
    </View>
  );
}
