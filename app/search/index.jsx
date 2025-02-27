import { Text, View, TextInput, FlatList,Image, ScrollView } from "react-native";
import React, { useEffect } from "react";
import Search from "../../assets/icons/search.svg";
import { useState } from "react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IP_URL = Constants.expoConfig.extra.IP_URL;
const Base_Image_URL = Constants.expoConfig.extra.Base_Image_URL;

const Index = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [actors, setActors] = useState([]);

  const getMovies = async () => {
    try {
      if(!search)
        return;
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${IP_URL}/search/movie/:${search}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setMovies(data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const getTvShows = async () => {
    try {
      if(!search)
        return;
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${IP_URL}/search/tv/:${search}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setTvShows(data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const getActors = async () => {
    try{
      if(!search)
        return;
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${IP_URL}/search/person/:${search}`,{
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setActors(data.content);
    }
    catch(error){
      console.error(error);
    }
  };

  useEffect(() => {
    getActors();
    getTvShows();
    getMovies();
  }, [search]);

  return (
    <ScrollView className="bg-[#000000] h-full">
      <View className="px-[20px]">
        <View className="mt-[20px]">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#FFFFFFB2"
            style={{ borderColor: "#808080B2", borderWidth: 3 }}
            className="pr-[40px] font-robotoRegular pl-[20px] rounded-[4px] text-[#FFFFFFB2] font-normal text-[14px] leading-[24px] bg-[#161616B2] py-[20px]"
            placeholder="Search for shows, movies or artists..."
          />

          <Search
            width={20}
            height={20}
            style={{ position: "absolute", right: 20, marginTop: 25 }}
          />
        </View>

        <Text className="mt-[40px] text-[20px] leading-[32px] font-robotoRegular font-normal color-[#FFFFFF]">Artists</Text>

        <FlatList
          data={actors}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 15, marginBottom: 0 }}
          renderItem={({ item, index }) => (
            <View className={`${index != 0 && "ml-[20px]"}`}>
              <Image
              source={{ uri: `${Base_Image_URL}${item.profile_path}` }}
              style={{ width: 60, height: 60,margin:'auto', marginLeft: index != 0 && 20,borderRadius:"50%" }}
              contentFit="cover"
              transition={500}
            />
              <Text className="color-[#FFFFFF] text-center mt-[10px] text-[12px] leading-[12px] font-normal font-robotoRegular">{item.name}</Text>
            </View>
          )}
        />

        <Text className="mt-[40px] text-[20px] leading-[32px] font-robotoRegular font-normal color-[#FFFFFF]">Movies</Text>

        <FlatList
          data={movies}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 15 }}
          renderItem={({ item, index }) => (
            <Image
              source={{ uri: `${Base_Image_URL}${item.poster_path}` }}
              style={{ width: 120, height: 180, marginLeft: index != 0 && 20 }}
              contentFit="cover"
              transition={500}
            />
          )}
        />

        <Text className="mt-[40px] text-[20px] leading-[32px] font-robotoRegular font-normal color-[#FFFFFF]">Tv Shows</Text>

        <FlatList
          data={tvShows}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 15, marginBottom: 0 }}
          renderItem={({ item, index }) => (
            <Image
              source={{ uri: `${Base_Image_URL}${item.poster_path}` }}
              style={{ width: 120, height: 180, marginLeft:index != 0 && 20 }}
              contentFit="cover"
              transition={500}
            />
          )}
        />
      </View>
    </ScrollView>
  );
};

export default Index;
