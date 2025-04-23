import {
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import AllTvShows from "../../components/tvShows/AllTvShows";
import { router } from "expo-router";
import Constants from "expo-constants";

import Vector from "../../assets/icons/Vector.svg";
import LeftArrow2 from "../../assets/icons/leftArrow2";
import LeftArrow3 from "../../assets/icons/leftArrow3";

import "../../i18n";
import { useTranslation } from "react-i18next";
import LanguagesDropDown from "../../components/LanguagesDropDown";
import ThemeToggle from "../../components/ThemeToggle";
import { useTheme } from "@/theme/ThemeContext";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Circle,
} from "lucide-react-native";

import { ActivityIndicator } from "react-native"; // For loading spinner
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const IP_URL = Constants.expoConfig.extra.IP_URL;
const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const TvShows = () => {
  const [allTVShows, setAllTVShows] = useState([]);
  const [isLoadingTv, setIsLoadingTv] = useState(false);
  const [currentTVPage, setCurrentTVPage] = useState(1);
  const [totalTVPages, setTotalTVPages] = useState(1);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const getTrendingTVShows = async (page = 1) => {
    setIsLoadingTv(true);
    try {
      const response = await fetch(
        `${IP_URL}/tv/allTvShows/${page}?lang=${i18n.language}`
      );

      setAllTVShows([]);

      if (response.ok) {
        const datas = await response.json();
        setAllTVShows(datas.tvShows);
        setTotalTVPages(datas.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTv(false);
    }
  };

  useEffect(() => {
    getTrendingTVShows(currentTVPage);
  }, [i18n.language]);

  const handleTVShowsPageChange = (page) => {
    if (page >= 1 && page <= totalTVPages) {
      setCurrentTVPage(page);
      getTrendingTVShows(page);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      className={`${isDark ? "bg-black" : "bg-white"} py-5`}
    >
      <View className="w-full flex flex-row justify-between">
        <TouchableOpacity className="mt-[5px] ml-[20px]" onPress={() => router.back()}>
          {isDark ? (
            <LeftArrow2 height={40} width={40} />
          ) : (
            <LeftArrow3 height={40} width={40} />
          )}
        </TouchableOpacity>
        {/* <Vector
          style={{ marginLeft: 50, marginTop: 10 }}
          width={100}
          height={25}
        /> */}
        <View className="flex flex-row">
          <View className="mt-[7px]">
            <ThemeToggle />
          </View>
          <View>
            <LanguagesDropDown ml={230} mt={100} />
          </View>
        </View>
      </View>

      <View className="mx-[20px]">
        <Text
          style={{
            fontFamily: "Roboto-Regular",
            fontSize: 20,
            color: isDark ? "#FFFFFF" : "black",
            marginTop: 50,
          }}
        >
          {t("all_tv_shows")}
        </Text>

        {isLoadingTv ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <ActivityIndicator size="large" color="#E50914" />
            <Text style={{ color: "#E50914", marginTop: 10 }}>
              {t("loading")}
            </Text>
          </View>
        ) : (
          <FlatList
            data={allTVShows}
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
                  <Text
                    style={{ color: isDark ? "#fff" : "black", fontSize: 16 }}
                  >
                    {t("no_tv_shows_available")}
                  </Text>
                </View>
              )
            }
            renderItem={({ item, index }) =>
              item && <AllTvShows item={item} mediaType="tv" index={index} />
            }
          />
        )}

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
            style={{
              marginRight: 10,
              opacity: currentTVPage === 1 ? 0.4 : 1,
            }}
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
              style={{
                color: "#FFFFFF",
                marginTop: 5,
                fontWeight: "bold",
              }}
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: isDark ? "black" : "white",
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.7)" : "#f5f5f5",
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
                color: isDark ? "#FFFFFF" : "black",
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
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.7)" : "#f5f5f5",
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
                color: isDark ? "#FFFFFF" : "black",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {t("view_tv_genres")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default TvShows;

export const unstable_settings = {
  gestureEnabled: true,
};
