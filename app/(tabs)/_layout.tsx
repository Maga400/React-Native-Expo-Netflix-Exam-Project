import React, { useEffect, useState } from "react";
import { Platform, ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tabs, router, Redirect } from "expo-router";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import "../../global.css";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [token, setToken] = useState<string | null>(null);
  const [first, setFirst] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
      </View>
    );
  }

  if (!first) {
    return <Redirect href="/board" />;
  }

  if (first && !token) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/movies" />;

  // return (
  //   <SafeAreaProvider>
  //     <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
  //       <Tabs
  //         screenOptions={{
  //           tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
  //           headerShown: false,
  //           tabBarButton: HapticTab,
  //           tabBarBackground: TabBarBackground,
  //           tabBarStyle: Platform.select({
  //             ios: {
  //               position: "absolute",
  //             },
  //             default: {},
  //           }),
  //         }}
  //       >
  //         <Tabs.Screen
  //           name="index"
  //           options={{
  //             title: "Home",
  //             tabBarIcon: ({ color }) => (
  //               <IconSymbol size={28} name="house.fill" color={color} />
  //             ),
  //           }}
  //         />

  //         <Tabs.Screen
  //           name="search"
  //           options={{
  //             title: "Search",
  //             tabBarIcon: ({ color }) => (
  //               <IconSymbol size={28} name="magnifyingglass" color={color} />
  //             ),
  //           }}
  //         />
  //       </Tabs>
  //     </SafeAreaView>
  //   </SafeAreaProvider>
  // );
}
