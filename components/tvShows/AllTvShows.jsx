import { TouchableOpacity, View, Text } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import Constants from "expo-constants";
import defaultPoster from "../../assets/images/defaultPoster.png";
import { useTheme } from "@/theme/ThemeContext";

const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const TrendingTVShows = ({ item, mediaType, index }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/movies/details/[id]",
          params: { id: item?.id, mediaType: mediaType, start: "" },
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
        style={{ width: 120, height: 180, marginLeft: index != 0 && 20 }}
        contentFit="cover"
        transition={500}
      />
      <View
        style={{
          width: 120,
          display: "flex",
          justifyContent: "center",
          marginLeft: index != 0 && 20,
        }}
      >
        <Text className={`w-full ${isDark ? "color-white" : "color-black"} text-center mt-[10px]`}>
          {item?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TrendingTVShows;
