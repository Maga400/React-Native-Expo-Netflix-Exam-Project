import { Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

const TrendingMovies = ({item,index}) => {
  const baseImageUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <TouchableOpacity onPress={() => router.push({
      pathname: "/movies/details/[id]",
      params: { id: item.id, mediaType: item.media_type,start:"" }
    })}>
      <Image
        source={{ uri: `${baseImageUrl}${item.poster_path}` }}
        className={`w-[120px] h-[180px] ${index != 0 && "ml-[20px]"} `}
        />
    </TouchableOpacity>
  );
};

export default TrendingMovies;
