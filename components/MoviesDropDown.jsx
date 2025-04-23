import { useCallback, useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import defaultPoster from "../assets/images/defaultPoster.png";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import "../i18n";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/theme/ThemeContext";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Circle,
} from "lucide-react-native";

const IP_URL = Constants.expoConfig.extra.IP_URL;
const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const MoviesDropDown = () => {
  const [movies, setMovies] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [first, setFirst] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const movieCategories = [
    { label: t("top_rated"), value: "top_rated" },
    { label: t("popular"), value: "popular" },
    { label: t("upcoming"), value: "upcoming" },
    { label: t("now_playing"), value: "now_playing" },
  ];

  const getMovieByCategory = async (page) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${IP_URL}/movie/categories?category=${value}&page=${page}&lang=${i18n.language}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setMovies([]);

      if (response.ok) {
        const data = await response.json();
        setMovies(data.movies);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);
  const buttonRef = useRef(null);
  const [top, setTop] = useState(0);
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");

  const onSelect = useCallback((item) => {
    setValue(item.value);
    setCurrentPage(1);
    setTotalPages(1);
    setLabel(item.label);
    setExpanded(false);
    setFirst(true);
  }, []);

  const handleMoviesPageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getMovieByCategory(page);
    }
  };

  useEffect(() => {
    if (value) {
      getMovieByCategory(currentPage);
    }
  }, [value]);

  useEffect(() => {
    if (value) {
      getMovieByCategory(currentPage);

      const selectedCategory = movieCategories.find(
        (cat) => cat.value === value
      );
      if (selectedCategory) {
        setLabel(selectedCategory.label);
      }
    }
  }, [i18n.language]);

  return (
    <View className={`${isDark ? "bg-black" : "bg-white"} px-[20px]`}>
      <View
        ref={buttonRef}
        className="py-[20px] mt-[10px]"
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          const topOffset = layout.y;
          const heightOfComponent = layout.height;

          const finalValue =
            topOffset +
            heightOfComponent +
            (Platform.OS === "android" ? -32 : 60);

          setTop(finalValue);
        }}
      >
        <TouchableOpacity
          onPress={toggleExpanded}
          className={`h-[50px] justify-between ${isDark ? "bg-[#fff]" : "bg-[#141414]"} w-full items-center flex-row px-[15px] rounded-[8px]`}
        >
          <Text className={`${isDark ? "text-black" : "text-white"} text-[15px] opacity-[0.8]`}>
            {label || t("select_movie_category")}
          </Text>
          <AntDesign color={isDark ? "black" : "white"} name={expanded ? "caretup" : "caretdown"} />
        </TouchableOpacity>
        {expanded ? (
          <Modal visible={expanded} transparent>
            <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
              <View className="p-[20px] mb-[50px] justify-center flex-1 items-center">
                <View
                  style={{ top }}
                  className={`absolute ${isDark ? "bg-white" : "bg-[#141414]"} w-full p-[10px] rounded-[6px] max-h-[250px] ml-[20px] mt-[10px]`}
                >
                  <FlatList
                    data={movieCategories}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) =>
                      item && (
                        <TouchableOpacity
                          className="h-[45px] justify-center"
                          activeOpacity={0.8}
                          onPress={() => onSelect(item)}
                        >
                          <Text className={`${isDark ? "text-black" : "text-white"}`}>{item.label}</Text>
                        </TouchableOpacity>
                      )
                    }
                    ItemSeparatorComponent={<View className="h-[10px]"></View>}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : null}
      </View>

      {value && (
        <Text className={`font-robotoRegular font-normal text-[20px] leading-[32px] ${isDark ? "color-[#FFFFFF]" : "color-black"} mt-[15px]`}>
          {label} {t("all_movies")}
        </Text>
      )}

      {isLoading ? (
        <View className="justify-center items-center mt-[20px]">
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={{ color: "#E50914", marginTop: 10 }}>
            {t("loading")}
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            marginTop: 10,
          }}
          data={movies}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading &&
            first == true && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text style={{ color: isDark ? "#fff" : "black", fontSize: 16 }}>
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
                    marginLeft: index != 0 && 20,
                  }}
                  contentFit="cover"
                  transition={500}
                />
              </TouchableOpacity>
            )
          }
        />
      )}

      {value && (
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
          className="w-full"
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
                  currentPage === Math.round(totalPages / 2)
                    ? "#777"
                    : "#E50914"
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
      )}
    </View>
  );
};

export default MoviesDropDown;
