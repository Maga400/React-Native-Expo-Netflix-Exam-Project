import { Image } from "expo-image";

const Similar = ({ item, index }) => {
  const baseImageUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <Image
      source={{ uri: `${baseImageUrl}${item.poster_path}` }}
      style={{ width: 120, height: 180, marginLeft: index != 0 && 20 }}
      contentFit="cover"
      transition={500}
    />
  );
};

export default Similar;
