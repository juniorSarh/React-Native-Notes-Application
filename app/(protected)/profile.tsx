import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(protected)/home")}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <View style={{ width: 26 }} /> {/* spacer */}
      </View>

      {/* PROFILE CARD */}
      <View style={styles.card}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>

        <Text style={styles.name}>
          {user?.username || "Guest User"}
        </Text>
        <Text style={styles.emailText}>{user?.email}</Text>

        {/* FORM */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>New Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Optional"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#999"
          />

          {/* SAVE BUTTON */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 40,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },

  name: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
  },

  emailText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  form: {
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});