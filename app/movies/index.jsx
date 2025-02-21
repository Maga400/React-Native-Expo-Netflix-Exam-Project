import { Text, View, Image, FlatList,Dimensions,ImageBackground, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Vector from "../../assets/icons/Vector.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrendingTVShows from '../../components/tvShows/TrendingTVShows';
import TrendingMovies from "../../components/movies/TrendingMovies";
import { router } from "expo-router";

const Movies = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTVShows, setTrendingTVShows] = useState([]);
  const baseImageUrl = "https://image.tmdb.org/t/p/w500";
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width-40;
  const [path,setPath] = useState("");
  
  const getTrendingMovies = async () => {
    try {
      const response = await fetch(
        "http://192.168.100.8:5001/api/v1/movie/trending"
      );

      if (response.ok) {
        const datas = await response.json();
        setTrendingMovies(datas.content);
        setPath(datas.content[0].poster_path);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTrendingTVShows = async () => {
    try {
      const response = await fetch(
        "http://192.168.100.8:5001/api/v1/tv/trending"
      );

      if (response.ok) {
        const datas = await response.json();
        setTrendingTVShows(datas.content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // AsyncStorage.removeItem('token');
    // AsyncStorage.removeItem('first');
    getTrendingMovies();
    getTrendingTVShows();
  }, []);

  return (
    <ScrollView className={`bg-[#000000] p-[20px]`}>
      <Vector width={90} height={25} style={{ marginTop: 20 }} />
      <ImageBackground source={{ uri: `${baseImageUrl}${path}` }}
        style={{width:width,borderRadius:10}}
        className={`mt-[30px] h-[470px]`}
      >
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: "/movies/details/[id]",
            params: { id: trendingMovies[0].id, mediaType: trendingMovies[0].media_type,start:"start"}
          })}
          style={{position:'absolute',width:(width-30) /2,left:10,bottom:25,borderRadius:4,backgroundColor:'#FFFFFF',alignItems:'center',paddingTop:15,paddingBottom:15}}>
          <Text className='font-poppinsRegular font-bold text-[16px] leading-[24px] color-[#000000]'>Play</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{position:'absolute',width:(width-30) /2,right:10,bottom:25,borderRadius:4,backgroundColor:'#515451',alignItems:'center',paddingTop:15,paddingBottom:15}}>
          <Text className='font-poppinsRegular font-bold text-[16px] leading-[24px] color-[#FFFFFF]'>More Info</Text>
        </TouchableOpacity>
      </ImageBackground>

      <Text className="font-robotoRegular font-normal text-[20px] leading-[32px] color-[#FFFFFF] mt-[15px]">
        Trending Movies
      </Text>

      <FlatList
        data={trendingMovies}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item, index }) => (
          <TrendingMovies item={item} index={index} />
        )}
      />

      <Text className="mt-[30px] font-robotoRegular font-normal text-[20px] leading-[32px] color-[#FFFFFF]">
        Popular TV Shows
      </Text>

      <FlatList
        data={trendingTVShows}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 20,marginBottom:50 }}
        renderItem={({ item, index }) => (
          <TrendingTVShows item={item} index={index} />
        )}
      />
    </ScrollView>
  );
};

export default Movies;
