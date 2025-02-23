import { Text, View,Dimensions,FlatList, ScrollView } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import YoutubePlayer from "react-native-youtube-iframe";
import Similar from "../../../components/similar/Similar";
import Constants from 'expo-constants';

const IP_URL = Constants.expoConfig.extra.IP_URL;

const Details = () => {
  const [data, setData] = useState({});
  const [similar,setSimilar] = useState([]);
  const [genres,setGenres] = useState([]);
  const [trailerKey, setTrailerKey] = useState("");
  const { id, mediaType,start } = useLocalSearchParams();
  const [playing, setPlaying] = useState(false);
  const width = Dimensions.get('window').width-40;

  const getData = async () => {
    try {
      const response = await fetch(
        `${IP_URL}/${mediaType}/${id}/details`
      );
      const apiData = await response.json();
      setGenres(apiData.content.genres);
      setData(apiData.content);
    } catch (error) {
      console.error(error);
    }
  };

  const getTrailer = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${IP_URL}/${mediaType}/${id}/trailers`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiData = await response.json();
      setTrailerKey(apiData.trailers[0].key);
    } catch (error) {
      console.error(error);
    }
  };

  const getSimilar = async() => {
    try{
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${IP_URL}/${mediaType}/${id}/similar`,{
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
        });

        const apiData = await response.json();
        console.log(apiData.similar[0]);
        setSimilar(apiData.similar);
    }
    catch(error)
    {
      console.error(error);
    }
  }

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    getData();
    getTrailer();
    getSimilar();
  }, []);

  return (
    <ScrollView className="bg-[#000000] h-full w-full">
      <YoutubePlayer
        height={225}
        play={start === "start" ? true: playing}
        videoId={trailerKey}
        onChangeState={onStateChange}
      />
      <Text className='font-normal font-robotoRegular text-[36px] leading-[40px] color-[#FFFFFF] mt-[20px] ml-[20px]'>{mediaType === "movie" ? data.title : data.name}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className='flex-row ml-[20px] mr-[20px] mt-[20px]'>
        {genres.map((item,index) => (
            <View key={item.id} className={`bg-[#27272A] p-[20px] rounded-[4px] ${index !== 0 && "ml-[20px]"}`}>
                <Text className='color-[#FFFFFF] font-inter18ptRegular font-normal text-[12px] leading-[24px]'>{item.name}</Text>
            </View>
        ))}
      </ScrollView>

      
      <Text style={{width:width}} className='mt-[20px] font-poppinsRegular font-normal text-[14px] leading-[24px] ml-[20px]  color-[#FFFFFF]'>{data.overview}</Text>
        
      <Text className='ml-[20px] mt-[30px] text-[20px] leading-[32px] font-robotoRegular font-normal color-[#FFFFFF]'>Similar TV Shows</Text>
    
      <FlatList
        data={similar}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{marginLeft:20,marginTop: 20 }}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <Similar item={item} index={index} />
        )}
      />

    </ScrollView>
  );
};

export default Details;
