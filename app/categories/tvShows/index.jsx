import { View, TouchableOpacity } from "react-native";
import TvShowsDropDown from "../../../components/TvShowsDropDown";
import LeftArrow2 from "../../../assets/icons/leftArrow2";
import { router } from "expo-router";
import LanguagesDropDown from "../../../components/LanguagesDropDown";

const Index = () => {
  return (
    <View className="bg-black h-full">
      <View className="flex flex-row justify-between">
        <TouchableOpacity onPress={() => router.back()} className="ml-[20px]">
          <LeftArrow2 height={40} width={40} />
        </TouchableOpacity>
        <LanguagesDropDown ml={230} mt={85} />
      </View>
      <TvShowsDropDown />
    </View>
  );
};

export default Index;

export const unstable_settings = {
    gestureEnabled: true,
};