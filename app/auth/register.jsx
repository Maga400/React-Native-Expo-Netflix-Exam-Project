import { Text, View, Platform, TouchableOpacity } from "react-native";
import React from "react";
import Vector from "../../assets/icons/Vector.svg";
import Input from "../../components/Input/Input";
import { useState } from "react";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import Show from "../../assets/icons/show.svg";
import Hide from "../../assets/icons/hide.svg";
import Toast from "react-native-toast-message";
import LanguagesDropDown from "../../components/LanguagesDropDown";
import "../../i18n";
import { useTranslation } from "react-i18next";

const IP_URL = Constants.expoConfig.extra.IP_URL;

const Register = () => {
  const [formData, setFromData] = useState({});
  const [isSecure, setIssecure] = useState(true);
  const { t, i18n } = useTranslation();
  const os = Platform.OS;
  const router = useRouter();

  const register = async () => {
    try {
      const response = await fetch(`${IP_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/auth/login");
      } else {
        Toast.show({
          type: "error",
          text1: t("error"),
          text2: data.message || t("something_went_wrong!"),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#000000",
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
      className="h-full w-full"
    >
      <View className="w-full flex flex-row justify-between">
        <Vector style={{ marginTop: 12 }} width={89} height={24} />
        <LanguagesDropDown ml={190} mt={95} />
      </View>
      <Text
        style={{ fontWeight: 700, lineHeight: 37.5 }}
        className="mt-[200px] color-white text-[32px] font-robotoRegular"
      >
        {t("sign_up")}
      </Text>
      <Input
        name="username"
        setFormData={setFromData}
        value={formData?.username}
        placeholder={t("username")}
        style={{
          backgroundColor: "#161616B2",
          fontWeight: 400,
          lineHeight: 24,
        }}
        className={`mt-[30px] text-[#FFFFFFB2] text-[16px] border-[1px] font-robotoRegular rounded-[4px] border-[#808080B2] pl-4 bg-white ${
          os === "ios" && "py-4"
        }`}
      />
      <Input
        name="email"
        setFormData={setFromData}
        value={formData?.email}
        placeholder={t("email")}
        style={{
          backgroundColor: "#161616B2",
          fontWeight: 400,
          lineHeight: 24,
        }}
        className={`mt-[15px] text-[#FFFFFFB2] text-[16px] border-[1px] font-robotoRegular rounded-[4px] border-[#808080B2] pl-4 bg-white ${
          os === "ios" && "py-4"
        }`}
      />
      <View>
        <Input
          isSecure={isSecure}
          name="password"
          setFormData={setFromData}
          value={formData?.password}
          placeholder={t("password")}
          style={{
            backgroundColor: "#161616B2",
            fontWeight: 400,
            lineHeight: 24,
          }}
          className={`mt-[15px] text-[#FFFFFFB2] text-[16px] border-[1px] font-robotoRegular rounded-[4px] border-[#808080B2] pl-4 bg-white ${
            os === "ios" && "py-4"
          }`}
        />
        <TouchableOpacity
          className="absolute right-[5] top-[30]"
          TouchableOpacity
          onPress={() => setIssecure(!isSecure)}
        >
          {isSecure ? (
            <Show height={30} width={30} stroke="white" fill="white" />
          ) : (
            <Hide height={30} width={30} fill="white" />
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={register}
        className="mt-[25px] bg-[#E50914] rounded-[4px] items-center"
      >
        <Text className="my-[11px] color-[#FFFFFF] font-medium font-robotoRegular text-[16px] leading-[16px]">
          {t("sign_up")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push("auth/login");
        }}
        className="flex-row justify-center items-center"
      >
        <Text className="mt-[25px] color-[#FFFFFFB2] font-robotoRegular font-normal text-[16px] leading-[19px]">
          {t("already_have_an_to_netflix")}{" "}
        </Text>
        <Text className="mt-[25px] color-[#FFFFFF] font-robotoRegular font-medium text-[16px] leading-[19px]">
          {t("sign_in")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
