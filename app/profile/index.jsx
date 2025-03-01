import { Text, TouchableOpacity, View,Image } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Constants from "expo-constants";

const IP_URL = Constants.expoConfig.extra.IP_URL;

const Index = () => {
  const logout = async () => {
    try {
      const response = await fetch(`${IP_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept":  "application/json"
        }
      });

      if(response.ok)
      {
        await AsyncStorage.setItem("token", "");
        router.push("/auth/login");
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="h-full w-full" style={{backgroundColor:"black",padding:20 }}>
       <View className="items-center mb-8">
        <Image
          source={require("../../assets/images/UserBG.webp")}
          className="w-32 h-32 rounded-full border-2 border-white"
        />
        <Text className="mt-3 text-2xl font-bold text-white">
          profile.username
        </Text>
      </View>

      <View className="bg-gray-800 rounded-lg p-4 mb-8">
        <View className="mb-4">
          <Text className="text-sm text-gray-400">Email</Text>
          <Text className="text-lg text-white">profile.email</Text>
        </View>
        <View>
          <Text className="text-sm text-gray-400">Password</Text>
          <Text className="text-lg text-white">password</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={logout}
        className="bg-red-600 rounded-lg py-4 items-center"
      >
        <Text className="text-white text-lg font-bold">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;
