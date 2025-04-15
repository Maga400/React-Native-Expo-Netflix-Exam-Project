import {
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Search from "../../assets/icons/search.svg";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import UserIcon from "../../assets/icons/userIcon.svg";
import LanguagesDropDown from "../../components/LanguagesDropDown";
import "../../i18n";
import { useTranslation } from "react-i18next";
import defaultPoster from "../../assets/images/defaultPoster.png";

const IP_URL = Constants.expoConfig.extra.IP_URL;
const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const Index = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [actors, setActors] = useState([]);
  const [loadingActors, setLoadingActors] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingTvShows, setLoadingTvShows] = useState(false);
  const { t, i18n } = useTranslation();
  const [actorsFirst, setActorsFirst] = useState(false);
  const [moviesFirst, setMoviesFirst] = useState(false);
  const [tvShowsFirst, setTvShowsFirst] = useState(false);

  const getMovies = async (signal) => {
    try {
      if (search.length < 3) {
        setMovies([]);
        setMoviesFirst(false);
        return;
      }
      setLoadingMovies(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${IP_URL}/search/movie/:${search}?lang=${i18n.language}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );

      setMovies([]);

      if (response.ok) {
        const data = await response.json();
        setMovies(data.content);
        setMoviesFirst(true);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    } finally {
      setLoadingMovies(false);
    }
  };

  const getTvShows = async (signal) => {
    try {
      if (search.length < 3) {
        setTvShows([]);
        setTvShowsFirst(false);
        return;
      }
      setLoadingTvShows(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${IP_URL}/search/tv/:${search}?lang=${i18n.language}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );

      setTvShows([]);

      if (response.ok) {
        const data = await response.json();
        setTvShows(data.content);
        setTvShowsFirst(true);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    } finally {
      setLoadingTvShows(false);
    }
  };

  const getActors = async (signal) => {
    try {
      if (search.length < 3) {
        setActors([]);
        setActorsFirst(false);
        return;
      }
      setLoadingActors(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${IP_URL}/search/person/:${search}?lang=${i18n.language}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );

      setActors([]);

      if (response.ok) {
        const data = await response.json();
        setActors(data.content);
        setActorsFirst(true);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    } finally {
      setLoadingActors(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (search.length < 3) {
      setMovies([]);
      setTvShows([]);
      setActors([]);
      controller.abort();
      return;
    }

    getActors(controller.signal);
    getTvShows(controller.signal);
    getMovies(controller.signal);

    return () => {
      controller.abort();
    };
  }, [search, i18n.language]);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      className="bg-[#000000] h-full"
    >
      <View className="px-[20px]">
        <View className="flex flex-row justify-end">
          <LanguagesDropDown ml={190} mt={85} />
        </View>
        <View className="mt-[20px]">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#FFFFFFB2"
            style={{ borderColor: "#808080B2", borderWidth: 3 }}
            className="pr-[40px] font-robotoRegular pl-[20px] rounded-[4px] text-[#FFFFFFB2] font-normal text-[14px] leading-[24px] bg-[#161616B2] py-[20px]"
            placeholder={t("search")}
          />

          <Search
            width={20}
            height={20}
            style={{ position: "absolute", right: 20, marginTop: 25 }}
          />
        </View>
        {loadingActors ? (
          <View className="justify-center items-center mt-[20px]">
            <ActivityIndicator size="large" color="#E50914" />
            <Text style={{ color: "#E50914", marginTop: 10 }}>
              {t("loading")}
            </Text>
          </View>
        ) : (
          <View>
            {!loadingActors && actorsFirst && (
              <Text className="mt-[40px] text-[20px] leading-[32px] font-robotoRegular font-normal color-[#FFFFFF]">
                {t("artists")}
              </Text>
            )}
            <FlatList
              data={actors}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginTop: 15, marginBottom: 0 }}
              ListEmptyComponent={
                !loadingActors &&
                actorsFirst && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 16 }}>
                      {t("no_actors_available")}
                    </Text>
                  </View>
                )
              }
              renderItem={({ item, index }) =>
                item && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/artists/details/[id]",
                        params: {
                          actorData: JSON.stringify(item),
                        },
                      })
                    }
                    className={`${index !== 0 ? "ml-[20px]" : ""}`}
                  >
                    {item?.profile_path ? (
                      <Image
                        source={{
                          uri: `${Base_Image_URL}${item?.profile_path}`,
                        }}
                        style={{
                          width: 60,
                          height: 60,
                          margin: "auto",
                          borderRadius: 100,
                        }}
                      />
                    ) : (
                      <UserIcon
                        width={60}
                        height={60}
                        style={{ margin: "auto", borderRadius: 100 }}
                      />
                    )}
                    <Text className="color-[#FFFFFF] text-center mt-[10px] text-[12px] leading-[12px] font-normal font-robotoRegular">
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                )
              }
            />
          </View>
        )}

        {loadingMovies ? (
          <View className="justify-center items-center mt-[20px]">
            <ActivityIndicator size="large" color="#E50914" />
            <Text style={{ color: "#E50914", marginTop: 10 }}>
              {t("loading")}
            </Text>
          </View>
        ) : (
          <View>
            {!loadingMovies && moviesFirst && (
              <Text className="mt-[40px] text-[20px] leading-[32px] font-robotoRegular font-normal color-[#FFFFFF]">
                {t("movies")}
              </Text>
            )}
            <FlatList
              data={movies}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginTop: 15 }}
              ListEmptyComponent={
                !loadingMovies &&
                moviesFirst && (
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
                item && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/movies/details/[id]",
                        params: {
                          id: item?.id,
                          mediaType: "movie",
                          start: "",
                        },
                      })
                    }
                  >
                    <Image
                      source={
                        item?.poster_path || item?.backdrop_path
                          ? {
                              uri: `${Base_Image_URL}${
                                item?.poster_path || item?.backdrop_path
                              }`,
                            }
                          : defaultPoster
                      }
                      style={{
                        width: 120,
                        height: 180,
                        marginLeft: index !== 0 && 20,
                      }}
                    />
                  </TouchableOpacity>
                )
              }
            />
          </View>
        )}

        {loadingTvShows ? (
          <View className="justify-center items-center mt-[20px]">
            <ActivityIndicator size="large" color="#E50914" />
            <Text style={{ color: "#E50914", marginTop: 10 }}>
              {t("loading")}
            </Text>
          </View>
        ) : (
          <View>
            {!loadingTvShows && tvShowsFirst && (
              <Text className="mt-[40px] text-[20px] leading-[32px] font-robotoRegular font-normal color-[#FFFFFF]">
                {t("tv_shows")}
              </Text>
            )}

            <FlatList
              data={tvShows}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginTop: 15, marginBottom: 0 }}
              ListEmptyComponent={
                !loadingTvShows &&
                tvShowsFirst && (
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
                item && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/movies/details/[id]",
                        params: {
                          id: item?.id,
                          mediaType: "tv",
                          start: "",
                        },
                      })
                    }
                  >
                    <Image
                      source={
                        item?.poster_path || item?.backdrop_path
                          ? {
                              uri: `${Base_Image_URL}${
                                item?.poster_path || item?.backdrop_path
                              }`,
                            }
                          : defaultPoster
                      }
                      style={{
                        width: 120,
                        height: 180,
                        marginLeft: index !== 0 && 20,
                      }}
                    />
                  </TouchableOpacity>
                )
              }
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Index;
