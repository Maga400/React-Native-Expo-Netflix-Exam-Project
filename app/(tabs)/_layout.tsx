import { useEffect, useState } from "react";
import { ActivityIndicator, View, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, Redirect } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeContext";
import "../../global.css";

const AnimatedTabIcon = ({ focused, color, name }) => {
  const scale = focused ? new Animated.Value(1.2) : new Animated.Value(1);

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.2 : 1,
      friction: 3,
      tension: 150,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons size={28} name={name} color={color} />
    </Animated.View>
  );
};

export default function TabLayout() {
  const { theme } = useTheme(); // ThemeContext'ten tema al
  const [token, setToken] = useState<string | null>(null);
  const [first, setFirst] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // light/dark ayarları
  const isDark = theme === "dark";
  const tabBarBackground = isDark ? "#000" : "#fff";
  const tabBarActiveColor = isDark ? "#fff" : "#000";
  const tabBarInactiveColor = "#888";

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedFirst = await AsyncStorage.getItem("first");

        console.log("Stored Token:", storedToken);
        console.log("Stored First:", storedFirst);

        setToken(storedToken);
        setFirst(storedFirst);
      } catch (error) {
        console.error("AsyncStorage Error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStorage();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={tabBarActiveColor} />
      </View>
    );
  }

  if (!first) {
    return <Redirect href="/board" />;
  }

  if (first && !token) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: tabBarBackground }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: tabBarActiveColor,
            tabBarInactiveTintColor: tabBarInactiveColor,
            headerShown: false,
            tabBarStyle: {
              backgroundColor: tabBarBackground,
              position: "relative",
              borderTopWidth: 0,
              paddingTop: 5,
              height: 60,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 5,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <AnimatedTabIcon focused={focused} color={color} name={focused ? "home" : "home-outline"} />
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: "Search",
              tabBarIcon: ({ color, focused }) => (
                <AnimatedTabIcon focused={focused} color={color} name={focused ? "search" : "search-outline"} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, focused }) => (
                <AnimatedTabIcon focused={focused} color={color} name={focused ? "person" : "person-outline"} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
