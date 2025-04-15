import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import Constants from "expo-constants";
import defaultPoster from "../../assets/images/defaultPoster.png";


const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const TrendingMovies = ({ item, index }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/movies/details/[id]",
          params: { id: item.id, mediaType: item.media_type, start: "" },
        })
      }
    >
      <Image
        source={item.poster_path || item.backdrop_path ? {
          uri: `${Base_Image_URL}${item.poster_path || item.backdrop_path}`,
        } : defaultPoster}
        style={{ width: 120, height: 180, marginLeft: index != 0 && 20 }}
        contentFit="cover"
        transition={500}
      />
    </TouchableOpacity>
  );
};

export default TrendingMovies;
