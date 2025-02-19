import { Text, View,Platform, TouchableOpacity } from "react-native";
import React from "react";
import Vector from "../../assets/icons/Vector.svg";
import Input from '../../components/Input/Input'
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const[formData,setFromData] = useState({});
  const os = Platform.OS;
  const router = useRouter();

  const login = async () => {
    try {
      const response = await fetch(
        "http://192.168.100.8:5001/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("token", data.token);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{backgroundColor:'#000000',padding:'20'}} className="h-full w-full" >
      <Vector width={89} height={24}  style={{marginTop:27}}/>
      <Text style={{fontWeight:700,lineHeight:37.5}} className="mt-[200px] color-white text-[32px] font-robotoRegular" >Sign In</Text>
      <Input name='email' setFormData={setFromData} value={formData?.email} placeholder='Email' style={{backgroundColor:'#161616B2',fontWeight:400,lineHeight:24}} className={`mt-[30px] text-[#FFFFFFB2] text-[16px] border-[1px] font-robotoRegular rounded-[4px] border-[#808080B2] pl-4 bg-white ${os === 'ios' && "py-4"}`} />
      <Input name='password' setFormData={setFromData} value={formData?.password} placeholder='Password' style={{backgroundColor:'#161616B2',fontWeight:400,lineHeight:24}} className={`mt-[15px] text-[#FFFFFFB2] text-[16px] border-[1px] font-robotoRegular rounded-[4px] border-[#808080B2] pl-4 bg-white ${os === 'ios' && "py-4"}`} />
      <TouchableOpacity onPress={login} className='mt-[25px] bg-[#E50914] rounded-[4px] items-center'>
        <Text className='my-[11px] color-[#FFFFFF] font-medium font-robotoRegular text-[16px] leading-[16px]'>Sign In</Text>
      </TouchableOpacity>
      <View className='flex-row justify-center'>
        <Text className='mt-[25px] color-[#FFFFFFB2] font-robotoRegular font-normal text-[16px] leading-[19px]'>New to Netflix?</Text>
        <Text className='mt-[25px] ml-[5px] color-[#FFFFFF] font-robotoRegular font-medium text-[16px] leading-[19px]' onPress={() => {
          router.push('auth/register');
        }}>Sign up now</Text>
      </View>
    </View>
  );
};

export default Login;
