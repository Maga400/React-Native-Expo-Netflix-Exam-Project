import {
  Text,
  View,
  FlatList,
  Dimensions,
  ImageBackground,
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import TrendingTVShows from "../../components/tvShows/TrendingTVShows";
import TrendingMovies from "../../components/movies/TrendingMovies";
import { router } from "expo-router";
import Constants from "expo-constants";

import Vector from "../../assets/icons/Vector.svg";
import MovieIcon from "../../assets/icons/movie.svg";
import TvIcon from "../../assets/icons/tv.svg";
import LanguagesDropDown from "../../components/LanguagesDropDown";
import "../../i18n";
import { useTranslation } from "react-i18next";

const IP_URL = Constants.expoConfig.extra.IP_URL;
const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const Movies = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTVShows, setTrendingTVShows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTVPages, setTotalTVPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTv, setIsLoadingTv] = useState(false);
  const width = Dimensions.get("window").width - 40;
  const [path, setPath] = useState("");
  const { t, i18n } = useTranslation();

  const getTrendingMovies = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${IP_URL}/movie/trending/${page}?lang=${i18n.language}`
      );
      if (response.ok) {
        const datas = await response.json();
        setTrendingMovies(datas.movies);
        setTotalPages(datas.totalPages);
        setPath(datas.movies[0]?.poster_path);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendingTVShows = async (page = 1) => {
    setIsLoadingTv(true);
    try {
      const response = await fetch(
        `${IP_URL}/tv/trending/${page}?lang=${i18n.language}`
      );
      if (response.ok) {
        const datas = await response.json();
        setTrendingTVShows(datas.tvShows);
        setTotalTVPages(datas.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTv(false);
    }
  };

  useEffect(() => {
    getTrendingMovies();
    getTrendingTVShows();
  }, []);

  useEffect(() => {
    getTrendingMovies();
    getTrendingTVShows();
  }, [i18n.language]);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      className="bg-black p-5"
    >
      <View className="flex flex-row justify-between">
        <Vector width={90} height={30} style={{ marginTop: 10 }} />
        <View className="flex flex-row">
          <View>
            <LanguagesDropDown ml={35} mt={100} />
          </View>
          <TouchableOpacity onPress={() => router.push("/movies/allMovies")}>
            <MovieIcon width={30} height={40} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/tvShows")}>
            <TvIcon width={40} height={40} style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
      </View>

      {path && (
        <ImageBackground
          source={{ uri: `${Base_Image_URL}${path}` }}
          style={{ width: width }}
          className="mt-2 h-[470px] rounded-2xl overflow-hidden shadow-xl"
        >
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/movies/details/[id]",
                params: {
                  id: trendingMovies[0].id,
                  mediaType: trendingMovies[0].media_type,
                  start: "start",
                },
              })
            }
            style={{
              position: "absolute",
              width: (width - 30) / 2,
              left: 10,
              bottom: 25,
              borderRadius: 4,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              paddingTop: 15,
              paddingBottom: 15,
            }}
          >
            <Text
              className={`font-poppinsRegular font-bold ${
                i18n.language == "ru" ? "leading-[35px]" : "leading-[24px]"
              } text-[16px] color-[#000000]`}
            >
              {t("play")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/movies/moreinfo",
                params: {
                  id: trendingMovies[0].id,
                  mediaType: trendingMovies[0].media_type,
                },
              });
            }}
            style={{
              position: "absolute",
              width: (width - 30) / 2,
              right: 10,
              bottom: 25,
              borderRadius: 4,
              backgroundColor: "#515451",
              alignItems: "center",
              paddingTop: 15,
              paddingBottom: 15,
            }}
          >
            <Text
              className={`font-poppinsRegular text-center font-bold ${
                i18n.language == "ru"
                  ? "px-[10px] leading-[18px]"
                  : "leading-[24px]"
              } text-[16px] color-[#FFFFFF]`}
            >
              {t("more_info")}
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      )}

      <Text
        style={{
          fontFamily: "Roboto-Regular",
          fontSize: 20,
          color: "#FFFFFF",
          marginTop: 20,
        }}
      >
        {t("trending_movies")}
      </Text>

      {isLoading ? (
        <View className="justify-center items-center mt-[20px]">
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={{ color: "#E50914", marginTop: 10 }}>
            {t("loading")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={trendingMovies}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 20 }}
          ListEmptyComponent={
            !isLoading && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>
                  {t("no_movies_available")}
                </Text>
              </View>
            )
          }
          renderItem={({ item, index }) =>
            item && <TrendingMovies item={item} index={index} />
          }
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: 30,
            flex: 1,
            marginRight: 10,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e50914",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3,
          }}
          onPress={() => router.push("/categories/movies")}
        >
          <Text
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {t("view_movie_categories")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: 30,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e50914",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3,
          }}
          onPress={() => router.push("/genres/movies")}
        >
          <Text
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {t("view_movie_genres")}
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontFamily: "Roboto-Regular",
          fontSize: 20,
          color: "#FFFFFF",
          marginTop: 30,
        }}
      >
        {t("popular_tv_shows")}
      </Text>

      {isLoadingTv ? (
        <View className="justify-center items-center mt-[20px]">
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={{ color: "#E50914", marginTop: 10 }}>
            {t("loading")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={trendingTVShows}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 20 }}
          ListEmptyComponent={
            !isLoadingTv && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>
                  {t("no_tv_shows_available")}
                </Text>
              </View>
            )
          }
          renderItem={({ item, index }) =>
            item && <TrendingTVShows item={item} index={index} />
          }
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: 30,
            flex: 1,
            marginRight: 10,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e50914",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3,
          }}
          onPress={() => router.push("/categories/tvShows")}
        >
          <Text
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {t("view_tv_categories")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: 30,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e50914",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3,
          }}
          onPress={() => router.push("/genres/tvShows")}
        >
          <Text
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {t("view_tv_genres")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Movies;
