import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    await updateProfile(email, username, password || undefined);
    alert("Profile updated!");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Edit Profile</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
      />

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="New Password (optional)"
        secureTextEntry
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
      />

      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}
