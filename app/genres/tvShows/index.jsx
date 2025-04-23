import { View, TouchableOpacity } from "react-native";
import TvShowGenresDropDown from "../../../components/TvShowGenresDropDown";
import LeftArrow2 from "../../../assets/icons/leftArrow2";
import LeftArrow3 from "../../../assets/icons/leftArrow3";
import { router } from "expo-router";
import LanguagesDropDown from "../../../components/LanguagesDropDown";
import ThemeToggle from "../../../components/ThemeToggle";
import { useTheme } from "@/theme/ThemeContext";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View className={`${isDark ? "bg-black" : "bg-white"} h-full`}>
      <View className="flex flex-row justify-between">
        <TouchableOpacity onPress={() => router.back()} className="ml-[20px]">
          {isDark ? (
            <LeftArrow2 height={40} width={40} />
          ) : (
            <LeftArrow3 height={40} width={40} />
          )}
        </TouchableOpacity>
        <View className="flex flex-row">
          <View className="mt-[6px]">
            <ThemeToggle />
          </View>
          <LanguagesDropDown ml={230} mt={80} />
        </View>
      </View>
      <TvShowGenresDropDown />
    </View>
  );
};

export default Index;

export const unstable_settings = {
  gestureEnabled: true,
};
