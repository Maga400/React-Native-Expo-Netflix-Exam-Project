import {
  Text,
  View,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import YoutubePlayer from "react-native-youtube-iframe";
import Similar from "../../../components/similar/Similar";
import Constants from "expo-constants";
import LeftArrow2 from "../../../assets/icons/leftArrow2";
import LeftArrow3 from "../../../assets/icons/leftArrow3";
import "../../../i18n";
import { useTranslation } from "react-i18next";
import LanguagesDropDown from "../../../components/LanguagesDropDown";
import ThemeToggle from "../../../components/ThemeToggle";
import { useTheme } from "@/theme/ThemeContext";

const IP_URL = Constants.expoConfig.extra.IP_URL;

const SimilarDetails = () => {
  const [data, setData] = useState({});
  const [similar, setSimilar] = useState([]);
  const [genres, setGenres] = useState([]);
  const [trailerKey, setTrailerKey] = useState("");
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const { id, mediaType, start } = useLocalSearchParams();
  const [playing, setPlaying] = useState(false);
  const width = Dimensions.get("window").width - 40;
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const getData = async () => {
    try {
      const response = await fetch(
        `${IP_URL}/${mediaType}/${id}/details?lang=${i18n.language}`
      );
      const apiData = await response.json();
      setGenres(apiData.content.genres);
      setData(apiData.content);
    } catch (error) {
      console.error(error);
    }
  };

  const getTrailer = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${IP_URL}/${mediaType}/${id}/trailers?lang=${i18n.language}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiData = await response.json();
      apiData.trailers.forEach((trailer) => {
        if (trailer) {
          setTrailerKey(trailer.key);
          return;
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getSimilar = async () => {
    try {
      setLoadingSimilar(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${IP_URL}/${mediaType}/${id}/similar?lang=${i18n.language}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apiData = await response.json();
      setSimilar(apiData.similar);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    getData();
    getTrailer();
    getSimilar();
  }, []);

  useEffect(() => {
    getData();
    getTrailer();
    getSimilar();
  }, [i18n.language]);

  return (
    <ScrollView className={`${isDark ? "bg-black" : "bg-white"} h-full w-full`}>
      <View className="flex flex-row justify-between mb-[20px]">
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

      <YoutubePlayer
        height={225}
        play={start === "start" ? true : playing}
        videoId={trailerKey}
        onChangeState={onStateChange}
      />

      {(data?.title || data?.name) && (
        <Text
          className={`font-normal font-robotoRegular text-[36px] leading-[40px] ${
            isDark ? "color-[#FFFFFF]" : "color-black"
          } mt-[20px] ml-[20px]`}
        >
          {mediaType === "movie" ? data?.title : data?.name}
        </Text>
      )}

      {genres?.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row ml-[20px] mr-[20px] mt-[20px]"
        >
          {genres?.map((item, index) => (
            <View
              key={item?.id}
              className={`${
                isDark ? "bg-[#27272A]" : "bg-[#F3F4F6]"
              } px-[20px] py-[10px] rounded-[4px] ${
                index !== 0 && "ml-[20px]"
              }`}
            >
              <Text
                className={`${
                  isDark ? "color-[#FFFFFF]" : "color-[#1F2937]"
                } font-inter18ptRegular font-normal text-[12px] leading-[24px]`}
              >
                {item?.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      {data?.overview && (
        <Text
          style={{ width: width }}
          className={`mt-[20px] font-poppinsRegular font-normal text-[14px] leading-[24px] ml-[20px] ${
            isDark ? "color-[#FFFFFF]" : "color-black"
          }`}
        >
          {data?.overview}
        </Text>
      )}

      {loadingSimilar ? (
        <View className="justify-center items-center mt-[20px]">
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={{ color: "#E50914", marginTop: 10 }}>
            {t("loading")}
          </Text>
        </View>
      ) : (
        <>
          {!loadingSimilar && (
            <Text
              className={`ml-[20px] mt-[30px] text-[20px] leading-[32px] font-robotoRegular font-normal ${
                isDark ? "color-[#FFFFFF]" : "color-[black]"
              }`}
            >
              {mediaType === "movie"
                ? t("similar_movies")
                : t("similar_tv_shows")}
            </Text>
          )}

          <FlatList
            data={similar}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginLeft: 20, marginTop: 20 }}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              !loadingSimilar && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text style={{ color: isDark ? "#fff" : "black", fontSize: 16 }}>
                    {mediaType == "movie"
                      ? t("no_movies_available")
                      : t("no_tv_shows_available")}
                  </Text>
                </View>
              )
            }
            renderItem={({ item, index }) =>
              item && (
                <Similar
                  key={item.id}
                  item={item}
                  index={index}
                  mediaType={mediaType}
                />
              )
            }
          />
        </>
      )}

      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname:
              mediaType == "movie" ? "movies/moreinfo" : "movies/moreinfoTv",
            params: {
              id: id,
              mediaType: mediaType,
            },
          });
        }}
        className={`${isDark ? "bg-[#444444]" : "bg-[#F3F4F6]"} border-[1px] ${isDark ?  "border-zinc-900" : "border-[#E5E7EB]"} p-[12px] my-[20px] mx-[20px] rounded-[8px] items-center`}
      >
        <Text className={`${isDark ? "color-[#FFFFFF]" : "color-[#1F2937]"} text-[16px] font-montserratSemiBold`}>
          {t("more_info")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SimilarDetails;

export const unstable_settings = {
  gestureEnabled: true,
};
