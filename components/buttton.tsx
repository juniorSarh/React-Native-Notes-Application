import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rounded?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  title,
  onPress,
  backgroundColor = "#007bff",
  textColor = "#fff",
  icon,
  rounded = true,
  fullWidth = true,
  disabled = false,
  loading = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? "#9ba3af" : backgroundColor,
          borderRadius: rounded ? 14 : 5,
          width: fullWidth ? "40%" : undefined,
          opacity: disabled ? 0.7 : 1
        }
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        
        {/* Left Icon */}
        {icon && !loading && (
          <Ionicons
            name={icon}
            size={20}
            color={textColor}
            style={{ marginRight: 8 }}
          />
        )}

        {/* Loading Indicator */}
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        )}

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
