import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";

const TrendingTVShows = ({ item, index }) => {
  const baseImageUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/movies/details/[id]",
          params: { id: item.id, mediaType: item.media_type,start:"" },
        })
      }
    >
      <Image
      source={{ uri: `${baseImageUrl}${item.poster_path}` }}
      style={{ width: 120, height: 180, marginLeft:index != 0 && 20 }}
      contentFit="cover"
      transition={500}
      />
    </TouchableOpacity>
  );
};

export default TrendingTVShows;
