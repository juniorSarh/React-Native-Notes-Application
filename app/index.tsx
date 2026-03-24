import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  return (
    <LinearGradient
      colors={["#848fa7", "#1e293b", "#020617"]}
      style={styles.container}
    >
      {/* HEADER / HERO */}
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Ionicons name="document-text-outline" size={70} color="#fff" />
        </View>

        <Text style={styles.title}>Note App</Text>

        <Text style={styles.subtitle}>
          Capture your ideas, organize your thoughts, and stay productive
          anytime, anywhere.
        </Text>
      </View>

      {/* BUTTONS */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.secondaryText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        © 2024 Note App. All rights reserved.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 25,
  },

  header: {
    marginTop: 100,
    alignItems: "center",
  },

  iconWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#cbd5f5",
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  buttonContainer: {
    width: "100%",
    marginBottom: 40,
  },

  primaryButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  primaryText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#3b82f6",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  secondaryText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: 20,
  },
});