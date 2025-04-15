import { Text, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Constants from "expo-constants";
import "../../i18n";
import { useTranslation } from "react-i18next";
import LanguagesDropDown from "../../components/LanguagesDropDown";

const IP_URL = Constants.expoConfig.extra.IP_URL;

const Index = () => {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState("");
  const { t, i18n } = useTranslation();

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
      style={{ backgroundColor: "black", padding: 20 }}
    >
      <View className="flex flex-row justify-end">
        <LanguagesDropDown ml={190} mt={105} />
      </View>
      <View className="items-center mt-[30px] mb-8">
        <Image
          source={`${user?.image}`}
          className="w-32 h-32 rounded-full border-2 border-white"
        />
        <Text className="mt-3 text-2xl font-bold text-white">
          {user?.username}
        </Text>
      </View>

      <View className="bg-gray-800 rounded-lg p-4 mb-8">
        <View className="mb-4">
          <Text className="text-sm text-gray-400">{t("email")}</Text>
          <Text className="text-lg text-white">{user?.email}</Text>
        </View>
        <View>
          <Text className="text-sm text-gray-400">{t("password")}</Text>
          <Text className="text-lg text-white">{password}</Text>
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
