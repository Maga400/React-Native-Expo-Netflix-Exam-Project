import React from "react";
import { View, Switch, Animated, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons"; // Güneş/ay ikonları için

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <TouchableOpacity onPress={toggleTheme}>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#1F2937" : "#E5E7EB" }, // dark: slate-800, light: gray-200
        ]}
      >
        <Animated.View
          style={[
            styles.toggleCircle,
            {
              backgroundColor: isDark ? "#4ADE80" : "#FACC15", // dark: green-400, light: yellow-400
              alignSelf: isDark ? "flex-end" : "flex-start",
            },
          ]}
        >
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={16}
            color={isDark ? "white" : "#333"}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 32,
    borderRadius: 32,
    padding: 4,
    justifyContent: "center",
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
});
