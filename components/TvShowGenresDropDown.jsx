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
  ActivityIndicator, // Loading indicator import
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import "../i18n";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Circle,
} from "lucide-react-native";

const IP_URL = Constants.expoConfig.extra.IP_URL;
const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const TvShowGenresDropDown = () => {
  const [tvShows, setTvShows] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [genresLoading, setGenresLoading] = useState(false); // New state for genres loading
  const { t, i18n } = useTranslation();
  const [first, setFirst] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [top, setTop] = useState(0);
  const buttonRef = useRef(null);

  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

  const getAllGenres = async () => {
    setGenresLoading(true); // Show loading indicator for genres
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${IP_URL}/tv/genres?lang=${i18n.language}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setGenres(data.genres);

        if (selectedGenre) {
          const updated = data.genres.find((g) => g.id === selectedGenre.id);
          setSelectedGenre(updated);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGenresLoading(false); // Hide loading indicator for genres
    }
  };

  const getTvShowsByGenre = async (page) => {
    if (!selectedGenre) return;

    setIsLoading(true); // Show loading indicator for tv shows
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${IP_URL}/tv/genresByName?genreName=${selectedGenre.name}&page=${page}&lang=${i18n.language}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTvShows(data.tvShows);
        setTotalPages(data.totalPages);
      } else {
        setTvShows([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Hide loading indicator for tv shows
    }
  };

  const onSelect = useCallback((item) => {
    setSelectedGenre(item);
    setCurrentPage(1);
    setTotalPages(1);
    setExpanded(false);
    setFirst(true);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getTvShowsByGenre(page);
    }
  };

  useEffect(() => {
    getAllGenres();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      getTvShowsByGenre(currentPage);
    }
  }, [selectedGenre]);

  useEffect(() => {
    getAllGenres();
    if (selectedGenre) {
      getTvShowsByGenre(currentPage);
    }
  }, [i18n.language]);

  return (
    <View className="bg-black px-[20px]">
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
          className="h-[50px] justify-between bg-[#fff] w-full items-center flex-row px-[15px] rounded-[8px]"
        >
          <Text className="text-[15px] opacity-[0.8]">
            {selectedGenre?.name || t("select_tv_show_genre")}
          </Text>
          <AntDesign name={expanded ? "caretup" : "caretdown"} />
        </TouchableOpacity>

        {expanded && (
          <Modal visible={expanded} transparent>
            <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
              <View className="p-[20px] mb-[50px] justify-center flex-1 items-center">
                <View
                  style={{ top }}
                  className="absolute bg-white w-full p-[10px] rounded-[6px] max-h-[250px] ml-[20px] mt-[10px]"
                >
                  {genresLoading ? ( // Show loading spinner when genres are being loaded
                    <ActivityIndicator size="large" color="#E50914" />
                  ) : (
                    <FlatList
                      data={genres}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          className="h-[45px] justify-center"
                          activeOpacity={0.8}
                          onPress={() => onSelect(item)}
                        >
                          <Text>{item?.name}</Text>
                        </TouchableOpacity>
                      )}
                      ItemSeparatorComponent={<View className="h-[10px]" />}
                    />
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>

      <Text className="font-robotoRegular font-normal text-[20px] leading-[32px] color-[#FFFFFF] mt-[15px]">
        {selectedGenre?.name && `${selectedGenre?.name} ${t("tv_shows")}`}
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
          contentContainerStyle={{ marginTop: 10 }}
          data={tvShows}
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
                <Text style={{ color: "#fff", fontSize: 16 }}>
                  {t("no_tv_shows_available")}
                </Text>
              </View>
            )
          }
          renderItem={({ item, index }) => (
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
                contentFit="cover"
                transition={500}
              />
            </TouchableOpacity>
          )}
        />
      )}

      {selectedGenre && (
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
            onPress={() => handlePageChange(1)}
            style={{ marginRight: 10, opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <ChevronsLeft
              size={30}
              color={currentPage === 1 ? "#777" : "#E50914"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={currentPage === 1 || isLoading}
            onPress={() => handlePageChange(currentPage - 1)}
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
              onPress={() => handlePageChange(Math.round(totalPages / 2))}
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
            onPress={() => handlePageChange(currentPage + 1)}
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
            onPress={() => handlePageChange(totalPages)}
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

export default TvShowGenresDropDown;
