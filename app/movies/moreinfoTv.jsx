import {
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import defaultPoster from "../../assets/images/defaultPoster.png";
import defaultLogo from "../../assets/images/defaultLogo.png";
import Constants from "expo-constants";
import { router, useLocalSearchParams } from "expo-router";
import LeftArrow2 from "../../assets/icons/leftArrow2";
import LeftArrow3 from "../../assets/icons/leftArrow3";
import "../../i18n";
import { useTranslation } from "react-i18next";
import LanguagesDropDown from "../../components/LanguagesDropDown";
import ThemeToggle from "../../components/ThemeToggle";
import { useTheme } from "@/theme/ThemeContext";

const IP_URL = Constants.expoConfig.extra.IP_URL;
const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const MoreInfoTv = () => {
  const [data, setData] = useState({});
  const [seasons, setSeasons] = useState([]);
  const { id, mediaType } = useLocalSearchParams();
  const width = Dimensions.get("window").width;
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const getData = async () => {
    try {
      const response = await fetch(
        `${IP_URL}/${mediaType}/${id}/details?lang=${i18n.language}`
      );
      const apiData = await response.json();
      setData(apiData.content);
      console.log(apiData.content);
      setSeasons(apiData.content.seasons);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [i18n.language]);

  return (
    <ScrollView className={`${isDark ? "bg-black" : "bg-white"} flex-1`}>
      <View className="flex flex-row justify-between">
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
      <View className="m-[20px]">
        <Image
          source={
            data?.poster_path || data?.backdrop_path
              ? {
                  uri: `https://image.tmdb.org/t/p/w500${
                    data?.poster_path || data?.backdrop_path
                  }`,
                }
              : defaultPoster
          }
          className="h-[300px] rounded-[10px]"
          style={{ width: width - 40 }}
          resizeMode="stretch"
        />
        <View>
          {data?.name && (
            <Text
              className={`${
                isDark ? "color-[#FFFFFF]" : "color-[black]"
              } text-[32px] font-bold my-[10px]`}
            >
              {data?.name}
            </Text>
          )}

          {data?.tagline && (
            <Text
              className={`${
                isDark ? "color-[#B0B0B0]" : "color-black"
              } text-[16px] mb-[5px]`}
            >
              {data?.tagline}
            </Text>
          )}
        </View>
      </View>

      {data?.overview && (
        <View className="mx-[20px]">
          <Text
            className={`${
              isDark ? "color-[#FFFFFF]" : "color-black"
            } text-[14px] leading-[24px] mb-[20px]`}
          >
            {data?.overview}
          </Text>
        </View>
      )}

      {data?.genres && data.genres?.length > 0 && (
        <View className="flex-row mb-[20px] ml-[20px]">
          {data.genres.map((genre, index) => (
            <View
              key={genre?.id}
              className={`${
                isDark ? "bg-[#27272A]" : "bg-black"
              } py-[8px] px-[15px] mr-[10px] rounded-[5px] mb-[10px]`}
            >
              <Text className="color-[#FFFFFF] text-[12px]">{genre?.name}</Text>
            </View>
          ))}
        </View>
      )}

      {(data?.spoken_languages || data?.production_countries) && (
        <View className="flex-row">
          {data?.spoken_languages && data?.spoken_languages.length > 0 && (
            <View className="mr-[20px] mb-[20px] ml-[20px]">
              <Text
                className={`${
                  isDark ? "color-[#B0B0B0]" : "color-black"
                } text-[14px] font-bold`}
              >
                {t("languages")}
              </Text>
              {data?.spoken_languages.map((language, index) => (
                <Text
                  key={index}
                  className={`${
                    isDark ? "color-[#FFFFFF]" : "color-black"
                  } text-[12px] font-normal`}
                >
                  {language?.english_name}
                </Text>
              ))}
            </View>
          )}

          {data?.production_countries &&
            data?.production_countries.length > 0 && (
              <View className="mb-[20px] ml-[20px]">
                <Text
                  className={`${
                    isDark ? "color-[#B0B0B0]" : "color-black"
                  } text-[14px] font-bold`}
                >
                  {t("countries")}
                </Text>
                {data.production_countries.map((country, index) => (
                  <Text
                    className={`${
                      isDark ? "color-[#FFFFFF]" : "color-black"
                    } text-[12px]`}
                    key={index}
                  >
                    {country?.name}
                  </Text>
                ))}
              </View>
            )}
        </View>
      )}

      {data?.vote_average != 0 && data?.vote_count != 0 && (
        <View className="ml-[20px] mb-[20px]">
          {data?.vote_average != 0 && (
            <View className="flex flex-row">
              <Text
                className={`${
                  isDark ? "color-[#B0B0B0]" : "color-black"
                } text-[18px] font-bold`}
              >
                {t("rating")}
              </Text>
              <Text
                className={`${
                  isDark ? "color-[#FFFFFF]" : "color-black"
                } text-[18px] ml-[10px]`}
              >
                {data?.vote_average ? data?.vote_average.toFixed(1) : t("N/A")}{" "}
                / 10
              </Text>
            </View>
          )}

          {data?.vote_count != 0 && (
            <Text
              className={`${isDark ? "color-white" : "color-black"} mt-[5px]`}
            >
              {t("vote_count")}: {data?.vote_count}
            </Text>
          )}
        </View>
      )}

      {data?.popularity && (
        <Text
          className={`ml-[20px] mb-[20px] ${
            isDark ? "color-white" : "color-black"
          }`}
        >
          {t("popularity")}: {data?.popularity}
        </Text>
      )}

      {data?.first_air_date && (
        <Text
          className={`ml-[20px] mb-[0px] ${
            isDark ? "color-white" : "color-black"
          }`}
        >
          {t("first_air_date")}: {data?.first_air_date}
        </Text>
      )}

      {data?.last_air_date && (
        <Text
          className={`ml-[20px] mb-[20px] ${
            isDark ? "color-white" : "color-black"
          }`}
        >
          {t("last_air_date")} {data?.last_air_date}
        </Text>
      )}

      {data?.production_companies && data?.production_companies.length > 0 && (
        <View className="ml-[20px] mb-[20px]">
          <Text
            className={` ${
              isDark ? "color-[#B0B0B0]" : "color-black"
            } text-[14px] font-bold`}
          >
            {t("production_companies")}
          </Text>
          {data?.production_companies.map((company, index) => (
            <Text key={index} className={`text-[12px] ${isDark ? "color-[#FFFFFF]" : "color-black"}`}>
              {company?.name}
            </Text>
          ))}
        </View>
      )}

      {data?.budget && (
        <View className="ml-[20px] mb-[20px]">
          <Text className={`${isDark ? "color-[#B0B0B0]" : "color-black"} text-[14px]`}>
            {t("budget")}: ${data?.budget.toLocaleString()}
          </Text>
        </View>
      )}
      {data?.revenue && (
        <View className="ml-[20px] mb-[20px]">
          <Text className={`${isDark ? "color-[#B0B0B0]" : "color-black"} text-[14px]`}>
            {t("revenue")}: ${data?.revenue.toLocaleString()}
          </Text>
        </View>
      )}

      <Text className={`${isDark ? "color-[#FFFFFF]" : "color-black"} text-[20px] ml-[20px] mt-[20px] mb-[10px]`}>
        {t("seasons")}
      </Text>
      {seasons &&
        seasons?.length > 0 &&
        seasons?.map((season, index) => (
          <View
            key={season?.id}
            className="mb-[20px] flex-row items-start justify-between h-fit"
          >
            <Image
              source={
                season?.poster_path
                  ? { uri: `${Base_Image_URL}${season?.poster_path}` }
                  : defaultPoster
              }
              style={{
                width: width * 0.45,
                // height: 250,
                borderRadius: 10,
                minHeight:250,
                marginRight: 15,
                marginLeft: 5,
              }}
              className="h-full"
              resizeMode="stretch"
            />
            <View className="flex-1">
              <Text className={`${isDark ? "color-[#FFFFFF]" : "color-black"} text-[16px] mb-[5px]`}>
                {t("season")} {season?.season_number} - {season?.name}
              </Text>
              <Text className={`${isDark ? "color-[#FFFFFF]" : "color-black"} text-[14px]`}>
                {season?.overview}
              </Text>
            </View>
          </View>
        ))}

      {data?.networks && data?.networks[0]?.name && (
        <Text className={`${isDark ? "color-[#B0B0B0]" : "color-black"} text-[12px] mb-[20px] text-center`}>
          {t("powered_by")} {data?.networks && data?.networks[0]?.name}
        </Text>
      )}
    </ScrollView>
  );
};

export default MoreInfoTv;

export const unstable_settings = {
  gestureEnabled: true,
};
