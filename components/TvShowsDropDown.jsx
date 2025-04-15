import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  ActivityIndicator, // 👈 Eklendi
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

const TvShowsDropDown = () => {
  const [tvShows, setTvShows] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isLoadingTv, setIsLoadingTv] = useState(false);
  const [currentTVPage, setCurrentTVPage] = useState(1);
  const [totalTVPages, setTotalTVPages] = useState(1);
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [first, setFirst] = useState(false);

  const { t, i18n } = useTranslation();
  const buttonRef = useRef(null);
  const [top, setTop] = useState(0);

  const tvCategories = useMemo(
    () => [
      { label: t("top_rated"), value: "top_rated" },
      { label: t("popular"), value: "popular" },
      { label: t("on_the_air"), value: "on_the_air" },
      { label: t("airing_today"), value: "airing_today" },
    ],
    [t]
  );

  useEffect(() => {
    if (value) {
      const selected = tvCategories.find((c) => c.value === value);
      if (selected) setLabel(selected.label);
    }
  }, [value, tvCategories]);

  const getTvShowsByCategory = useCallback(
    async (page = 1) => {
      if (!value) return;

      setIsLoadingTv(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          `${IP_URL}/tv/categories?category=${value}&page=${page}&lang=${i18n.language}`,
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
          setTotalTVPages(data.totalPages);
        } else {
          setTvShows([]);
        }
      } catch (error) {
        console.error("TV fetch error:", error);
      } finally {
        setIsLoadingTv(false);
      }
    },
    [value, i18n.language]
  );

  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), []);

  const onSelect = useCallback((item) => {
    setValue(item.value);
    setLabel(item.label);
    setCurrentTVPage(1);
    setExpanded(false);
    setFirst(true);
  }, []);

  const handleTVShowsPageChange = (page) => {
    if (page >= 1 && page <= totalTVPages) {
      setCurrentTVPage(page);
    }
  };

  useEffect(() => {
    if (value) getTvShowsByCategory(currentTVPage);
  }, [value, currentTVPage]);

  useEffect(() => {
    getTvShowsByCategory(currentTVPage);
  }, [i18n.language]);

  return (
    <View className="bg-black px-[20px]">
      <View
        ref={buttonRef}
        className="py-[10px] mt-[10px]"
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          const finalValue =
            layout.y + layout.height + (Platform.OS === "android" ? -32 : 60);
          setTop(finalValue);
        }}
      >
        <TouchableOpacity
          onPress={toggleExpanded}
          className="h-[50px] justify-between bg-[#fff] w-full items-center flex-row px-[15px] rounded-[8px]"
        >
          <Text className="text-[15px] opacity-[0.8]">
            {label || t("select_tv_show_category")}
          </Text>
          <AntDesign name={expanded ? "caretup" : "caretdown"} />
        </TouchableOpacity>

        {expanded && (
          <Modal visible={expanded} transparent>
            <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
              <View className="p-[20px] justify-center flex-1 items-center">
                <View
                  style={{ top }}
                  className="absolute bg-white w-full p-[10px] rounded-[6px] max-h-[250px] ml-[20px] mt-[20px]"
                >
                  <FlatList
                    data={tvCategories}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="h-[45px] justify-center"
                        activeOpacity={0.8}
                        onPress={() => onSelect(item)}
                      >
                        <Text>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                      <View className="h-[10px]"></View>
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>

      {value && (
        <Text className="mt-[30px] font-robotoRegular font-normal text-[20px] leading-[32px] color-[#FFFFFF]">
          {label} {t("tv_shows")}
        </Text>
      )}

      {isLoadingTv ? (
        <View className="justify-center items-center mt-[20px]">
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={{ color: "#E50914", marginTop: 10 }}>
            {t("loading")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={tvShows}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 10 }}
          ListEmptyComponent={
            !isLoadingTv &&
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
                    id: item.id,
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
                  marginLeft: index !== 0 ? 20 : 0,
                }}
                contentFit="cover"
                transition={500}
              />
            </TouchableOpacity>
          )}
        />
      )}

      {value && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
            backgroundColor: "#121212",
            padding: 15,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOpacity: 0.4,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <TouchableOpacity
            disabled={currentTVPage === 1 || isLoadingTv}
            onPress={() => handleTVShowsPageChange(1)}
            style={{ marginRight: 10, opacity: currentTVPage === 1 ? 0.4 : 1 }}
          >
            <ChevronsLeft
              size={30}
              color={currentTVPage === 1 ? "#555" : "#E50914"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={currentTVPage === 1 || isLoadingTv}
            onPress={() => handleTVShowsPageChange(currentTVPage - 1)}
            style={{
              backgroundColor: "#E50914",
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 30,
              marginRight: 10,
              opacity: currentTVPage === 1 ? 0.4 : 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ChevronLeft size={25} color="white" />
          </TouchableOpacity>

          <View style={{ alignItems: "center", marginHorizontal: 10 }}>
            <TouchableOpacity
              disabled={
                currentTVPage === Math.round(totalTVPages / 2) || isLoadingTv
              }
              onPress={() =>
                handleTVShowsPageChange(Math.round(totalTVPages / 2))
              }
              style={{
                borderWidth: 2,
                borderColor:
                  currentTVPage === Math.round(totalTVPages / 2)
                    ? "#555"
                    : "#fff",
                borderRadius: 50,
                padding: 5,
              }}
            >
              <Circle
                size={25}
                color={
                  currentTVPage === Math.round(totalTVPages / 2)
                    ? "#555"
                    : "#E50914"
                }
              />
            </TouchableOpacity>
            <Text
              className="text-[10px]"
              style={{ color: "#FFFFFF", marginTop: 5, fontWeight: "bold" }}
            >
              {t("page")} {currentTVPage} / {totalTVPages}
            </Text>
          </View>

          <TouchableOpacity
            disabled={currentTVPage === totalTVPages || isLoadingTv}
            onPress={() => handleTVShowsPageChange(currentTVPage + 1)}
            style={{
              backgroundColor: "#E50914",
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 30,
              marginLeft: 10,
              opacity: currentTVPage === totalTVPages ? 0.4 : 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ChevronRight size={25} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={currentTVPage === totalTVPages || isLoadingTv}
            onPress={() => handleTVShowsPageChange(totalTVPages)}
            style={{
              marginLeft: 10,
              opacity: currentTVPage === totalTVPages ? 0.4 : 1,
            }}
          >
            <ChevronsRight
              size={30}
              color={currentTVPage === totalTVPages ? "#555" : "#E50914"}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TvShowsDropDown;
