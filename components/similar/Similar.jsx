import { Image } from "expo-image";
import Constants from "expo-constants";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import defaultPoster from "../../assets/images/defaultPoster.png";

const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const Similar = ({ item, index, mediaType }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/movies/similarDetails/[id]",
          params: { id: item?.id, mediaType: mediaType, start: "" },
        });
      }}
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
    </TouchableOpacity>
  );
};

export default Similar;
