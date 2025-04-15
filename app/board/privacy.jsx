import React, { useState } from "react";
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import Vector from "../../assets/icons/Vector.svg";
import LeftArrow from "../../assets/icons/leftArrow.svg";
import Printer from "../../assets/icons/printer.svg";
import Close from "../../assets/icons/close.svg";
import ChevronLeft from "../../assets/icons/chevronLeft.svg";
import ArrowDown from "../../assets/icons/arrowDown.svg";
import { useRouter } from "expo-router";
import LanguagesDropDown from "../../components/LanguagesDropDown";
import "../../i18n";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

const Privacy = () => {
  const width = Dimensions.get("window").width;
  const router = useRouter();
  const [showCookieInfo, setShowCookieInfo] = useState(true);
  const [message, setMessage] = useState("");
  const { t, i18n } = useTranslation();

  const handleCookieChange = () => {
    setMessage(t("cookie_preferences_updated"));
    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  const handleToggleCookieInfo = () => {
    setShowCookieInfo((prev) => !prev);
  };

  return (
    <ScrollView
      className="h-full"
      style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "black",
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft fill="white" width={25} height={25} />
        </TouchableOpacity>
        <Vector width={95} height={25} />
        <View style={{ width: 135 }}>
          <LanguagesDropDown ml={240} mt={105} />
        </View>
      </View>

      <View className="h-[5px] bg-[white] -mx-5 mb-4" />

      {showCookieInfo ? (
        <View className="flex-row items-start gap-x-2 mb-5 relative">
          <Text className="font-manropeMedium text-[14px] text-[white] w-[90%]">
            {t("your_cookie")}
          </Text>
          <TouchableOpacity
            style={{ position: "absolute", right: 0 }}
            onPress={handleToggleCookieInfo}
          >
            <Close stroke="white" width={20} height={20} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={handleToggleCookieInfo}>
          <View className="flex-row items-center mb-5">
            <ArrowDown fill="white" width={20} height={20} />
            <Text className="ml-2 text-white font-manropeMedium text-[14px]">
              {t("cookie_preferences_hidden")}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {message !== "" && (
        <View className="border-[1px] border-white rounded-md p-3 mb-4">
          <Text className="text-[white] font-manropeMedium text-[14px] text-center">
            {message}
          </Text>
        </View>
      )}

      <TouchableOpacity
        className="border border-white px-4 py-3 rounded-md w-[75%] mb-5"
        activeOpacity={0.8}
        onPress={handleCookieChange}
      >
        <Text className="text-white font-manropeMedium text-[14px]">
          {t("change_your_cookie_preferences")}
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.back()}
        >
          <LeftArrow width={25} height={25} />
          <Text className="ml-3 text-[#E50A14] font-manropeMedium text-[20px]">
            {t("back_to_help_home")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="border border-white p-2 rounded-[4px]">
          <Printer fill="white" width={25} height={25} />
        </TouchableOpacity>
      </View>

      <Text className="font-manropeExtraBold text-[28px] text-white mb-5">
        {t("privacy_statement")}
      </Text>

      <Text className="font-manropeMedium text-[16px] text-white leading-6 mb-5">
        {t("netflix_service")}
      </Text>

      <Text className="font-manropeExtraBold text-[20px] text-white mb-2">
        {t("contacting_us")}
      </Text>

      <Text className="font-manropeMedium text-[16px] text-white leading-6">
        {t("help_center")}{" "}
        <Text style={{ color: "#E50A14" }}>{t("help_netflix_com")}</Text>{" "}
        {t("office")}{" "}
        <Text style={{ color: "#E50A14" }}>{t("privacy_netflix_com")}</Text>
      </Text>
    </ScrollView>
  );
};

export default Privacy;

export const unstable_settings = {
  gestureEnabled: true,
};
