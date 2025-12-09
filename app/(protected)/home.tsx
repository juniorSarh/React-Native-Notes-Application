import { View, Text, Button } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

export default function Home() {
  const { logout, user } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Welcome, {user?.username} 🎉</Text>

      <Button title="Go to Profile" onPress={() => router.push("/(protected)/profile")} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
