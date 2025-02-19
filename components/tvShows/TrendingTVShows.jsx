import { Image } from "react-native";

const TrendingTVShows = ({item,index}) => {
  const baseImageUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <Image
      source={{ uri: `${baseImageUrl}${item.poster_path}` }}
      className={`w-[120px] h-[280px] ${index != 0 && "ml-[20px]"} `}
    />
  );
};

export default TrendingTVShows;
