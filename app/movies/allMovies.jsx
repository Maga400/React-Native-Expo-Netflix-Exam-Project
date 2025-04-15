import {
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AllMoviesC from "../../components/movies/AllMovies";
import { router } from "expo-router";
import Constants from "expo-constants";
import Vector from "../../assets/icons/Vector.svg";
import LeftArrow2 from "../../assets/icons/leftArrow2";
import "../../i18n";
import { useTranslation } from "react-i18next";
import LanguagesDropDown from "../../components/LanguagesDropDown";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Circle,
} from "lucide-react-native";

const IP_URL = Constants.expoConfig.extra.IP_URL;
const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const getTrendingMovies = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${IP_URL}/movie/allMovies/${page}?lang=${i18n.language}`
      );

      setMovies([]);

      if (response.ok) {
        const datas = await response.json();
        console.log(datas.movies[0]);
        setMovies(datas.movies);
        setTotalPages(datas.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTrendingMovies(currentPage);
  }, [i18n.language]);

  const handleMoviesPageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getTrendingMovies(page);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      className="bg-black p-5"
    >
      <View className="w-full flex flex-row justify-start">
        <TouchableOpacity className="mt-[5px]" onPress={() => router.back()}>
          <LeftArrow2 width={40} height={35} />
        </TouchableOpacity>
        <Vector
          style={{ marginLeft: 50, marginTop: 10 }}
          width={100}
          height={25}
        />
        <View className="ml-[20px]">
          <LanguagesDropDown ml={225} mt={100} />
        </View>
      </View>

      <Text
        style={{
          fontFamily: "Roboto-Regular",
          fontSize: 20,
          color: "#FFFFFF",
          marginTop: 50,
        }}
      >
        {t("all_movies")}
      </Text>

      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={{ color: "#fff", marginTop: 10 }}>{t("loading")}</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
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
            item && (
              <View>
                <AllMoviesC item={item} mediaType="movie" index={index} />
              </View>
            )
          }
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 20,
          backgroundColor: "#141414",
          padding: 15,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOpacity: 0.5,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 6,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          disabled={currentPage === 1 || isLoading}
          onPress={() => handleMoviesPageChange(1)}
          style={{ marginRight: 10, opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          <ChevronsLeft
            size={30}
            color={currentPage === 1 ? "#777" : "#E50914"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={currentPage === 1 || isLoading}
          onPress={() => handleMoviesPageChange(currentPage - 1)}
          style={{
            backgroundColor: "#E50914",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 25,
            marginRight: 10,
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={25} color="white" />
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginHorizontal: 10 }}>
          <TouchableOpacity
            style={{
              borderWidth: 2,
              borderColor:
                currentPage === Math.round(totalPages / 2) ? "#555" : "#fff",
              borderRadius: 50,
              padding: 5,
            }}
            disabled={currentPage === Math.round(totalPages / 2) || isLoading}
            onPress={() => handleMoviesPageChange(Math.round(totalPages / 2))}
          >
            <Circle
              size={25}
              color={
                currentPage === Math.round(totalPages / 2) ? "#777" : "#E50914"
              }
            />
          </TouchableOpacity>
          <Text
            className="text-[10px]"
            style={{ color: "#FFFFFF", marginTop: 5, fontWeight: "bold" }}
          >
            {t("page")} {currentPage} / {totalPages}
          </Text>
        </View>

        <TouchableOpacity
          disabled={currentPage === totalPages || isLoading}
          onPress={() => handleMoviesPageChange(currentPage + 1)}
          style={{
            backgroundColor: "#E50914",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 25,
            marginLeft: 10,
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          <ChevronRight size={25} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={currentPage === totalPages || isLoading}
          onPress={() => handleMoviesPageChange(totalPages)}
          style={{
            marginLeft: 10,
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          <ChevronsRight
            size={30}
            color={currentPage === totalPages ? "#777" : "#E50914"}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
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
    </ScrollView>
  );
};

export default AllMovies;

export const unstable_settings = {
  gestureEnabled: true,
};
