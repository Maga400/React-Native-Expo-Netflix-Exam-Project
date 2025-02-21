import { Image } from "react-native";
import React from "react";

const Similar = ({item,index}) => {
  const baseImageUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <Image
      source={{ uri: `${baseImageUrl}${item.poster_path}` }}
      className={`w-[120px] h-[180px] ${index != 0 && "ml-[20px]"} `}
    />
  );
};

export default Similar;
