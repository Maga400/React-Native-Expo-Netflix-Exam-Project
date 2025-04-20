import { Text, View } from "react-native";
import React from "react";
import { useTheme } from "@/theme/ThemeContext";

const Boarding = ({ item, boardIndex, lastIndex }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View className={`mt-[70px] items-center`}>
      {item?.icon}
      <Text
        className={`${
          boardIndex === lastIndex ? "mt-[280px] text-white" : "mt-[15px] text-black"
        } font-robotoRegular font-bold text-[24px] leading-[28px] ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {item?.title}
      </Text>
      <Text
        className={`${item?.weight} ${boardIndex === lastIndex && "color-[#CCCCCC]"} text-center mt-[20px] font-robotoRegular font-normal text-[20px] leading-[23px] ${
          isDark ? "color-[#CCCCCC]" : "text-black"
        } `}
      >
        {item?.description}
      </Text>
    </View>
  );
};

export default Boarding;
