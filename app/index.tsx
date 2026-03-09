import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  return (
    <View style={styles.container}>

      {/* Logo / Header */}
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={90} color="#007AFF" />
        <Text style={styles.title}>Note App</Text>
        <Text style={styles.subtitle}>
          Organize your thoughts, notes and ideas in one place.
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <LinearGradient
            colors={["#007AFF", "#00A8FF"]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.secondaryText}>Create Account</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  header: {
    alignItems: "center",
    marginBottom: 60,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: "#666",
    paddingHorizontal: 20,
  },

  buttonContainer: {
    width: "100%",
  },

  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  secondaryText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },

});