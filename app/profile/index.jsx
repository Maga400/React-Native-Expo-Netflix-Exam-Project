import { Text, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Constants from "expo-constants";
import "../../i18n";
import { useTranslation } from "react-i18next";
import LanguagesDropDown from "../../components/LanguagesDropDown";
import ThemeToggle from "../../components/ThemeToggle";
import { useTheme } from "@/theme/ThemeContext";

const IP_URL = Constants.expoConfig.extra.IP_URL;

const Index = () => {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState("");
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${IP_URL}/auth/authCheck`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUser(data.user);

        const pass = await AsyncStorage.getItem("password");

        pass && setPassword(pass);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${IP_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        await AsyncStorage.setItem("token", "");
        router.push("/auth/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View
      className="h-full w-full"
      style={{ backgroundColor: isDark ? "black" : "white", padding: 20 }}
    >
      <View className="flex flex-row justify-between">
        <View className="mt-[5px]">
          <ThemeToggle />
        </View>
        <View className="w-[145px]">
          <LanguagesDropDown ml={220} mt={105} />
        </View>
      </View>
      <View className="items-center mt-[30px] mb-8">
        <Image
          source={`${user?.image}`}
          className={`w-32 h-32 rounded-full border-2 ${
            isDark ? "border-white" : "border-black"
          }`}
        />
        <Text
          className={`mt-3 text-2xl font-bold ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {user?.username}
        </Text>
      </View>

      <View
        className={`${
          isDark ? "bg-gray-800" : "bg-[#E5E7EB]"
        } rounded-lg p-4 mb-8 `}
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        }}
      >
        <View className="mb-4">
          <Text
            className={`text-sm ${isDark ? "text-gray-400" : "text-[#4B5563]"}`}
          >
            {t("email")}
          </Text>
          <Text
            className={`text-lg ${isDark ? "text-white" : "text-[#111827]"}`}
          >
            {user?.email}
          </Text>
        </View>
        <View>
          <Text
            className={`text-sm ${isDark ? "text-gray-400" : "text-[#4B5563]"}`}
          >
            {t("password")}
          </Text>
          <Text
            className={`text-lg ${isDark ? "text-white" : "text-[#111827]"}`}
          >
            {password}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={logout}
        className="bg-red-600 rounded-lg py-4 items-center"
      >
        <Text className="text-white text-lg font-bold">{t("log_out")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;
