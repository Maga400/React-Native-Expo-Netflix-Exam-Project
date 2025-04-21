import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import LeftArrow2 from "../../assets/icons/leftArrow2";
import LeftArrow3 from "../../assets/icons/leftArrow3";
import defaultPoster from "../../assets/images/defaultPoster.png";
import defaultLogo from "../../assets/images/defaultLogo.png";
import "../../i18n";
import { useTranslation } from "react-i18next";
import LanguagesDropDown from "../../components/LanguagesDropDown";
import ThemeToggle from "../../components/ThemeToggle";
import { useTheme } from "@/theme/ThemeContext";

const IP_URL = Constants.expoConfig.extra.IP_URL;

const MoreInfo = () => {
  const [movie, setMovie] = useState(null);
  const { id, mediaType } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const getData = async () => {
    try {
      const response = await fetch(
        `${IP_URL}/${mediaType}/${id}/details?lang=${i18n.language}`
      );
      const apiData = await response.json();
      setMovie(apiData.content);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [i18n.language]);

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#E50A14" />
      </View>
    );
  }

  return (
    <ScrollView className={`flex-1 ${isDark ? "bg-black" : "bg-white"}`}>
      <View className="flex flex-row justify-between mt-[15px] mb-[15px]">
        <TouchableOpacity onPress={() => router.back()}>
          {isDark ? (
            <LeftArrow2 height={40} width={40} />
          ) : (
            <LeftArrow3 height={40} width={40} />
          )}
        </TouchableOpacity>
        <View className="flex flex-row mt-[0px]">
          <View className="mt-[7px]">
            <ThemeToggle />
          </View>
          <LanguagesDropDown ml={230} mt={85} />
        </View>
      </View>

      <View className="relative">
        <Image
          source={
            movie?.backdrop_path || movie?.poster_path
              ? {
                  uri: `https://image.tmdb.org/t/p/w500${
                    movie?.backdrop_path || movie?.poster_path
                  }`,
                }
              : defaultPoster
          }
          className="w-full h-96 opacity-60"
          resizeMode="stretch"
        />
        <View
          className={`absolute inset-0 ${
            isDark ? "bg-black" : "bg-zinc-700"
          } opacity-50`}
        ></View>
        {movie?.title && (
          <Text
            className={`absolute bottom-6 left-4 ${
              isDark ? "text-white" : "text-black"
            } text-4xl font-bold`}
          >
            {movie?.title}
          </Text>
        )}
      </View>

      <View className="px-4 py-6">
        <Image
          source={
            movie?.poster_path || movie?.backdrop_path
              ? {
                  uri: `https://image.tmdb.org/t/p/w500${
                    movie?.poster_path || movie?.backdrop_path
                  }`,
                }
              : defaultPoster
          }
          className="w-40 h-60 rounded-lg self-center mb-4"
          resizeMode="stretch"
        />

        {movie?.title && (
          <Text
            className={`${
              isDark ? "text-white" : "text-black"
            } text-center text-2xl font-bold`}
          >
            {movie?.title}
          </Text>
        )}

        {movie?.release_date?.split("-")[0] && (
          <Text
            className={`${
              isDark ? "text-gray-400" : "text-gray-700"
            } text-center`}
          >
            {movie?.release_date?.split("-")[0]}
          </Text>
        )}

        {movie?.tagline && (
          <Text
            className="text-yellow-400 text-xl font-bold text-center mt-2"
          >
            {movie?.tagline}
          </Text>
        )}
      </View>

      {movie?.genres.length > 0 && (
        <View className="flex-row flex-wrap justify-center mb-4">
          {movie?.genres.map((genre) => (
            <Text
              key={genre?.id}
              className={`${isDark ? "text-gray-300 bg-gray-800" :"text-white bg-black"} px-3 py-1 rounded-lg mr-2 mb-2`}
            >
              {genre?.name}
            </Text>
          ))}
        </View>
      )}

      <View className="p-4">
        {movie?.overview ? (
          <Text
            className={`${isDark ? "text-gray-200" : "text-black"} text-lg`}
          >
            {movie?.overview}
          </Text>
        ) : (
          <Text
            className={`${
              isDark ? "text-gray-500" : "text-black"
            } text-lg italic`}
          >
            {t("there_is_no_summary_information_available")}
          </Text>
        )}
      </View>

      {movie?.vote_average != 0 && movie?.vote_count != 0 && (
        <View className="flex-row justify-center items-center mt-4 mb-4">
          <Text className="text-yellow-400 text-2xl font-bold">
            ⭐ {movie?.vote_average}
          </Text>

          <Text
            className={`${
              isDark ? "text-gray-400" : "text-black"
            } text-lg ml-2`}
          >
            ({movie?.vote_count} {t("votes")})
          </Text>
        </View>
      )}

      <View className="p-4">
        {movie?.production_countries.length > 0 && (
          <Text
            className={`${isDark ? "text-gray-300" : "text-black"} text-lg`}
          >
            📍 {t("countries")}:{" "}
            <Text>
              {movie?.production_countries.map((c) => c.name).join(", ")}
            </Text>
          </Text>
        )}

        {movie?.spoken_languages.length > 0 && (
          <Text
            className={`${isDark ? "text-gray-300" : "text-black"} text-lg`}
          >
            🗣️ {t("languages")}:{" "}
            <Text>
              {movie?.spoken_languages.map((l) => l.english_name).join(", ")}
            </Text>
          </Text>
        )}

        {movie?.runtime && (
          <Text
            className={`${isDark ? "text-gray-300" : "text-black"} text-lg`}
          >
            ⌛ {t("duration")}: {movie?.runtime} minutes
          </Text>
        )}

        {movie?.budget.toLocaleString() != 0 && (
          <Text
            className={`${isDark ? "text-gray-300" : "text-black"} text-lg`}
          >
            💰 {t("budget")}: ${movie?.budget.toLocaleString()}
          </Text>
        )}

        {movie?.revenue.toLocaleString() != 0 && (
          <Text
            className={`${isDark ? "text-gray-300" : "text-black"} text-lg`}
          >
            📈 {t("revenue")}: <Text>${movie?.revenue.toLocaleString()}</Text>
          </Text>
        )}
      </View>

      {movie?.production_companies.length > 0 && (
        <View className="p-4">
          <Text
            className={`${
              isDark ? "text-white" : "text-black"
            } text-lg font-bold mb-2`}
          >
            🎬 {t("production_companies")}
          </Text>
          {movie?.production_companies.map((company) => (
            <View key={company?.id} className="flex-row items-center mb-2">
              <Image
                source={{
                  uri: company?.logo_path
                    ? `https://image.tmdb.org/t/p/w500${company?.logo_path}`
                    : defaultLogo,
                }}
                resizeMode="contain"
                className={`w-10 h-10 rounded-full mr-3 ${
                  isDark ? "bg-white" : "bg-black"
                }`}
              />

              {company?.name && (
                <Text
                  className={`${
                    isDark ? "text-gray-400" : "text-black"
                  } text-lg`}
                >
                  {company?.name}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {movie?.imdb_id && (
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(`https://www.imdb.com/title/${movie?.imdb_id}/`)
          }
          className="p-4"
        >
          <Text className="text-blue-400 text-lg text-center">
            🔗 {t("open_imdb_page")}
          </Text>
        </TouchableOpacity>
      )}

      {movie?.homepage && (
        <TouchableOpacity
          onPress={() => Linking.openURL(movie?.homepage)}
          className="p-4"
        >
          <Text className="text-blue-400 text-lg text-center">
            🌐 {t("visit_movie_official_website")}
          </Text>
        </TouchableOpacity>
      )}

      {movie?.video && (
        <View className="p-4">
          <Button
            title="Watch Trailer"
            onPress={() =>
              Linking.openURL(`https://www.youtube.com/watch?v=${movie?.video}`)
            }
          />
        </View>
      )}
    </ScrollView>
  );
};

export default MoreInfo;

export const unstable_settings = {
  gestureEnabled: true,
};
