import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Login() {
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/(protected)/home");
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      setError("");
      await login(email, password);
      router.replace("/(protected)/home");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Home Icon */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push("/")}
      >
        <Ionicons name="home-outline" size={28} color="#007AFF" />
      </TouchableOpacity>

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Ionicons name="person-circle-outline" size={80} color="#007AFF" />
        <Text style={styles.appTitle}>Welcome Back</Text>
      </View>

      {/* Login Card */}
      <View style={styles.card}>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {/* Gradient Login Button */}
        <TouchableOpacity onPress={handleLogin}>
          <LinearGradient
            colors={["#007AFF", "#00A8FF"]}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Register */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F4F6F8",
    padding: 20,
  },

  homeButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },

  loginButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  registerButton: {
    marginTop: 15,
    alignItems: "center",
  },

  registerText: {
    color: "#007AFF",
    fontWeight: "600",
  },
});