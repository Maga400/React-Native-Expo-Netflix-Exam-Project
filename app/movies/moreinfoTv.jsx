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
import "../../i18n";
import { useTranslation } from "react-i18next";
import LanguagesDropDown from "../../components/LanguagesDropDown";

const IP_URL = Constants.expoConfig.extra.IP_URL;
const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const MoreInfoTv = () => {
  const [data, setData] = useState({});
  const [seasons, setSeasons] = useState([]);
  const { id, mediaType } = useLocalSearchParams();
  const width = Dimensions.get("window").width;
  const { t, i18n } = useTranslation();

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
    <ScrollView className="bg-black flex-1">
      <View className="flex flex-row justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <LeftArrow2 style={{ marginLeft: 20 }} width={40} height={40} />
        </TouchableOpacity>
        <LanguagesDropDown ml={230} mt={85} />
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
            <Text className="color-[#FFFFFF] text-[32px] font-bold my-[10px]">
              {data?.name}
            </Text>
          )}

          {data?.tagline && (
            <Text className="color-[#B0B0B0] text-[16px] mb-[5px]">
              {data?.tagline}
            </Text>
          )}
        </View>
      </View>

      {data?.overview && (
        <View className="mx-[20px]">
          <Text className="color-[#FFFFFF] text-[14px] leading-[24px] mb-[20px]">
            {data?.overview}
          </Text>
        </View>
      )}

      {data?.genres && data.genres?.length > 0 && (
        <View className="flex-row mb-[20px] ml-[20px]">
          {data.genres.map((genre, index) => (
            <View
              key={genre?.id}
              className="bg-[#27272A] py-[8px] px-[15px] mr-[10px] rounded-[5px] mb-[10px]"
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
              <Text className="color-[#B0B0B0] text-[14px]">
                {t("languages")}
              </Text>
              {data?.spoken_languages.map((language, index) => (
                <Text key={index} className="color-[#FFFFFF] text-[12px]">
                  {language?.english_name}
                </Text>
              ))}
            </View>
          )}

          {data?.production_countries &&
            data?.production_countries.length > 0 && (
              <View className="mb-[20px] ml-[20px]">
                <Text className="color-[#B0B0B0] text-[14px]">
                  {t("countries")}
                </Text>
                {data.production_countries.map((country, index) => (
                  <Text className="color-[#FFFFFF] text-[12px]" key={index}>
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
              <Text className="color-[#B0B0B0] text-[18px]">{t("rating")}</Text>
              <Text className="color-[#FFFFFF] text-[18px] ml-[10px]">
                {data?.vote_average ? data?.vote_average.toFixed(1) : t("N/A")} /
                10
              </Text>
            </View>
          )}

          {data?.vote_count != 0 && (
            <Text className="color-white mt-[5px]">
              {t("vote_count")}: {data?.vote_count}
            </Text>
          )}
        </View>
      )}

      {data?.popularity && (
        <Text className="ml-[20px] mb-[20px] color-white">
          {t("popularity")}: {data?.popularity}
        </Text>
      )}

      {data?.first_air_date && (
        <Text className="ml-[20px] mb-[0px] color-white">
          {t("first_air_date")}: {data?.first_air_date}
        </Text>
      )}

      {data?.last_air_date && (
        <Text className="ml-[20px] mb-[20px] color-white">
          {t("last_air_date")} {data?.last_air_date}
        </Text>
      )}

      {data?.production_companies && data?.production_companies.length > 0 && (
        <View className="ml-[20px] mb-[20px]">
          <Text className="color-[#B0B0B0] text-[14px]">
            {t("production_companies")}
          </Text>
          {data?.production_companies.map((company, index) => (
            <Text key={index} className="text-[12px] color-[#FFFFFF]">
              {company?.name}
            </Text>
          ))}
        </View>
      )}

      {data?.budget && (
        <View className="ml-[20px] mb-[20px]">
          <Text className="color-[#B0B0B0] text-[14px]">
            {t("budget")}: ${data?.budget.toLocaleString()}
          </Text>
        </View>
      )}
      {data?.revenue && (
        <View className="ml-[20px] mb-[20px]">
          <Text className="color-[#B0B0B0] text-[14px]">
            {t("revenue")}: ${data?.revenue.toLocaleString()}
          </Text>
        </View>
      )}

      <Text className="color-[#FFFFFF] text-[20px] ml-[20px] mt-[20px] mb-[10px]">
        {t("seasons")}
      </Text>
      {seasons &&
        seasons?.length > 0 &&
        seasons?.map((season, index) => (
          <View
            key={season?.id}
            className="mb-[20px] flex-row items-start justify-between"
          >
            <Image
              source={season?.poster_path ? { uri: `${Base_Image_URL}${season?.poster_path}` } : defaultPoster }
              style={{
                width: width * 0.45,
                height: 250,
                borderRadius: 10,
                marginRight: 15,
                marginLeft: 5,
              }}
              resizeMode="stretch"
            />
            <View className="flex-1">
              <Text className="color-[#FFFFFF] text-[16px] mb-[5px]">
                {t("season")} {season?.season_number} - {season?.name}
              </Text>
              <Text className="color-[#FFFFFF] text-[14px]">
                {season?.overview}
              </Text>
            </View>
          </View>
        ))}

      {data?.networks && data?.networks[0]?.name && (
        <Text className="color-[#B0B0B0] text-[12px] mb-[20px] text-center">
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
