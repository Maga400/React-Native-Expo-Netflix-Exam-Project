import "../global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import {MyThemeProvider} from "@/theme/ThemeContext"; 

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-LightItalic": require("../assets/fonts/Montserrat-LightItalic.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Inter_18pt-Regular": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Manrope-Regular": require("../assets/fonts/Manrope-Regular.ttf"),
    "Manrope-Medium": require("../assets/fonts/Manrope-Medium.ttf"),
    "Manrope-ExtraBold": require("../assets/fonts/Manrope-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <MyThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack
              screenOptions={{ headerShown: false, gestureEnabled: false }}
            >
              <Stack.Screen name="(tabs)/home" />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="movies/details/[id]"
                options={{ gestureEnabled: true }}
              />
              <Stack.Screen
                name="movies/allMovies"
                options={{ gestureEnabled: true }}
              />
              <Stack.Screen
                name="tvShows/index"
                options={{ gestureEnabled: true }}
              />
              <Stack.Screen
                name="movies/moreinfo"
                options={{ gestureEnabled: true }}
              />
              <Stack.Screen
                name="movies/moreinfoTv"
                options={{ gestureEnabled: true }}
              />
              <Stack.Screen
                name="board/privacy"
                options={{ gestureEnabled: true }}
              />
              <Stack.Screen
                name="artists/details/[id]"
                options={{ gestureEnabled: true }}
              />
              <Stack.Screen
                name="categories/movies/index"
                options={{ gestureEnabled: true }}
              />
              <Stack.Screen
                name="categories/tvShows/index"
                options={{ gestureEnabled: true }}
              />
              <Stack.Screen
                name="genres/movies/index"
                options={{ gestureEnabled: true }}
              />
              <Stack.Screen
                name="genres/tvShows/index"
                options={{ gestureEnabled: true }}
              />
            </Stack>
            <StatusBar style="light" translucent />
            <Toast />
          </ThemeProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </MyThemeProvider>
  );
}
