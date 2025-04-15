import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import Vector from "../../assets/icons/Vector.svg";
import Laptop from "../../assets/icons/laptop.svg";
import Download from "../../assets/icons/download.svg";
import Population from "../../assets/icons/population.svg";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Boarding from "../../components/Boarding";
import LanguagesDropDown from "../../components/LanguagesDropDown";
import "../../i18n";
import { useTranslation } from "react-i18next";

const Board = () => {
  const [boardIndex, setBoardIndex] = useState(0);
  const width = Dimensions.get("window").width - 20;
  const lastIndex = 3;
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const data = [
    {
      id: 1,
      title: t("title1"),
      description:
        t("description1"),
      icon: <Laptop width={265} height={250} />,
      weight: "w-[320px]",
    },
    {
      id: 2,
      title: t("title2"),
      description: t("description2"),
      icon: <Download width={290} height={280} />,
      weight: "w-[235px]",
    },
    {
      id: 3,
      title: t("title3"),
      description: t("description3"),
      icon: <Population width={310} height={240} />,
      weight: "w-[135px]",
    },
    {
      id: 4,
      title: t("title4"),
      description: t("description4"),
      icon: null,
      weight: "w-[340px]",
    },
  ];

  const bg =
    boardIndex === lastIndex ? require("../../assets/images/BG.png") : null;

  const finish = async () => {
    setBoardIndex((prevState) => prevState + 1);
    if (boardIndex == lastIndex) {
      router.push("/auth/login");
      await AsyncStorage.setItem("first", "yes");
    }
  };

  return (
    <ImageBackground
      source={bg}
      style={{ backgroundColor: "#000000" }}
      className="w-full h-full justify-center items-center"
    >
      <View className="w-full flex flex-row justify-end">
        <LanguagesDropDown ml={230} mt={85} />
      </View>
      <View className="w-full flex flex-row justify-between px-[20px]">
        <Vector width={130} height={40} style={{ marginTop: 40 }} />
        <View className="flex flex-row">
          <TouchableOpacity
            onPress={() => {
              router.push("board/privacy");
            }}
          >
            <Text className="top-[51px] font-normal font-robotoRegular text-[14px] leading-[17px] color-[#FFFFFF]">
              {t("privacy")}
            </Text>
          </TouchableOpacity>
          <Text className="top-[51px] ml-[10px] font-normal font-robotoRegular text-[14px] leading-[17px] color-[#FFFFFF]">
            {t("help")}
          </Text>
        </View>
      </View>
      <FlatList
        scrollEnabled={false}
        data={data.filter((_, index) => index === boardIndex)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Boarding item={item} boardIndex={boardIndex} lastIndex={lastIndex} />
        )}
      />

      <View className="mb-[35px] items-center flex-row">
        {data.map((_, index) => (
          <View
            key={index}
            className={`rounded-[4px] w-[10px] h-[10px] ${
              index != 0 && "ml-[20px]"
            } ${boardIndex === index ? "bg-red-600" : "bg-gray-300"}`}
          ></View>
        ))}
      </View>

      <TouchableOpacity
        onPress={finish}
        style={{ width: width }}
        className="bg-[#E50914] mb-[10px] mx-[10px] py-[10px] items-center"
      >
        <Text className="font-robotoRegular font-extrabold text-[14px] leading-[16px] color-[#000000]">
          {t("next")}
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default Board;
