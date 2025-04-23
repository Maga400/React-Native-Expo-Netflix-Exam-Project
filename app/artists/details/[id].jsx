import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import LeftArrow2 from "../../../assets/icons/leftArrow2";
import LeftArrow3 from "../../../assets/icons/leftArrow3";
import { router } from "expo-router";
import UserIcon from "../../../assets/icons/userIcon.svg";
import LanguagesDropDown from "../../../components/LanguagesDropDown";
import "../../../i18n";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import defaultPoster from "../../../assets/images/defaultPoster.png";
import ThemeToggle from "../../../components/ThemeToggle";
import { useTheme } from "@/theme/ThemeContext";

const IP_URL = Constants.expoConfig.extra.IP_URL;

const Details = () => {
  const { actorData } = useLocalSearchParams();
  const importantActor = JSON.parse(actorData);
  const firstName = importantActor.name;
  const [actor, setActor] = useState(importantActor);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const getActors = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${IP_URL}/search/person/:${firstName}?lang=${i18n.language}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActor(data.content[0]);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getActors();
  }, [i18n.language]);

  const getGenderText = (gender) => {
    if (gender === 1) return t("female");
    if (gender === 2) return t("male");
    return t("unknown");
  };

  return (
    <ScrollView className={`flex-1 ${isDark ? "bg-black" : "bg-white"}`}>
      <View className="flex flex-row justify-between">
        <TouchableOpacity className="mb-[10px]" onPress={() => router.back()}>
          {isDark ? (
            <LeftArrow2 height={40} width={40} />
          ) : (
            <LeftArrow3 height={40} width={40} />
          )}
        </TouchableOpacity>
        <View className="flex flex-row">
          <View className="mt-[6px]">
            <ThemeToggle />
          </View>
          <LanguagesDropDown ml={230} mt={80} />
        </View>
      </View>
      <View className="relative w-full h-[250px] items-center">
        {actor?.profile_path ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${actor?.profile_path}`,
            }}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            source={require(`../../../assets/images/UserBG.webp`)}
            className="w-full h-full object-cover"
          />
        )}

        <View className={`absolute w-full h-full ${isDark ? "bg-black" : "bg-gray-700"} opacity-50`} />
        {actor?.profile_path ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${actor?.profile_path}`,
            }}
            className={`w-[130px] h-[130px] rounded-full absolute bottom-[-60px] border-[3px] ${isDark ? "border-white" : "border-gray-400"}`}
          />
        ) : (
          <UserIcon
            width={130}
            height={130}
            style={{
              borderRadius: 100,
              position: "absolute",
              bottom: -60,
              borderWidth: 3,
              borderColor: "white",
              resizeMode: "cover",
            }}
          />
        )}
      </View>

      <View className="items-center mt-[70px] px-4">
        {actor?.name && (
          <Text className={`text-[28px] font-bold ${isDark ? "text-white" : "text-black"}`}>
            {actor?.name}
          </Text>
        )}

        {actor?.known_for_department && (
          <Text className={`text-base ${isDark ? "text-[#aaa]" : "text-zinc-500"} mt-1`}>
            🎭 {actor?.known_for_department}
          </Text>
        )}
      </View>

      <View className={`${isDark ? "bg-[#1e1e1e]" : ""} mx-4 my-5 p-4 rounded-2xl shadow-md border ${isDark ? "border-white" : "border-gray-100"}`}>
        {(actor?.original_name || actor?.name) && (
          <Text className={`text-sm ${isDark ? "text-[#ccc]" : "text-gray-800"} my-1`}>
            {t("original_name")} {actor?.original_name || actor?.name}
          </Text>
        )}

        {getGenderText(actor?.gender) && (
          <Text className={`text-sm  ${isDark ? "text-[#ccc]" : "text-gray-800"} my-1`}>
            {t("gender")} {getGenderText(actor?.gender)}
          </Text>
        )}

        {actor?.popularity.toFixed(2) && (
          <Text className={`text-sm ${isDark ? "text-[#ccc]" : "text-gray-800"} my-1`}>
            {t("popularity")}: {actor?.popularity.toFixed(2)}
          </Text>
        )}

        <Text className={`text-sm ${isDark ? "text-[#ccc]" : "text-gray-800"} my-1`}>
          {t("adult_content")} {actor?.adult ? "Yes" : "No"}
        </Text>
      </View>

      {actor?.known_for.length > 0 && (
        <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"} my-4 ml-4`}>
          🎬 {t("known_works")}
        </Text> 
      )}

      {actor?.known_for.length > 0 && (
        <FlatList
          data={actor?.known_for}
          keyExtractor={(item) => item?.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          renderItem={({ item }) =>
            item && (
              <View className={`${isDark ? "bg-[#242424]" :"bg-white"} rounded-lg p-2.5 mr-4 w-[200px] shadow-sm border ${isDark ? "border-white" : "border-gray-100"}`}>
                <Image
                  source={
                    item?.poster_path
                      ? {
                          uri: `https://image.tmdb.org/t/p/w500${item?.poster_path}`,
                        }
                      : defaultPoster
                  }
                  className="w-[180px] h-[270px] rounded-lg self-center"
                />

                {(item?.original_title || item?.name) && (
                  <Text className={`text-lg font-bold ${isDark ? "text-white" :"text-gray-800"} mt-2 text-center`}>
                    {item?.original_title || item?.name}
                  </Text>
                )}

                {item?.release_date && (
                  <Text className={`text-xs ${isDark ? "text-[#ffcc00]" : "text-indigo-600"} text-center mt-1`}>
                    {t("release")} {item?.release_date}
                  </Text>
                )}

                {item?.first_air_date && (
                  <Text className={`text-xs ${isDark ? "text-[#ffcc00]" : "text-indigo-600"} text-center mt-1`}>
                    {t("air_date")} {item?.first_air_date}
                  </Text>
                )}

                {item?.vote_average != 0 && item?.vote_count != 0 && (
                  <Text className={`text-xs ${isDark ? "text-[#ffcc00]" : "text-yellow-500"} text-center mt-1`}>
                    {t("rating")}: {item?.vote_average} ({item?.vote_count}{" "}
                    votes)
                  </Text>
                )}

                {item?.popularity.toFixed(1) && (
                  <Text className={`text-xs ${isDark ? "text-[#ffcc00]" : "text-gray-600"} text-center mt-1`}>
                    {t("language")}: {item?.original_language.toUpperCase()} -
                    Popularity: {item?.popularity.toFixed(1)}
                  </Text>
                )}

                {item?.overview && (
                  <Text
                    numberOfLines={3}
                    className={`text-xs ${isDark ? "text-[#ddd]" : "text-gray-500"} mt-1 text-justify`}
                  >
                    {item?.overview}
                  </Text>
                )}
              </View>
            )
          }
        />
      )}

      <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"} my-4 ml-4`}>
        📜 {t("description")}
      </Text>
      <Text className={`text-sm ${isDark ? "text-[#ddd]" : "text-black"} text-justify mb-5 px-4`}>
        {actor?.known_for?.[0]?.overview || t("description_not_available")}
      </Text>
    </ScrollView>
  );
};

export default Details;

export const unstable_settings = {
  gestureEnabled: true,
};
