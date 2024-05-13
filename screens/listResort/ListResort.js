import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getListResortActive } from "../../redux/actions/resortActions";

const ListResort = () => {
  const { resorts } = useSelector((state) => state.resorts);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      dispatch(getListResortActive());
    }, [dispatch])
  );

  return (
    <View className="flex-1">
      <View className="bg-blue-500 w-full h-[100px] flex flex-row items-center justify-start px-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text className="ml-8 text-[20px] text-white">List Resort</Text>
      </View>

      <ScrollView className="py-3">
        {resorts?.content?.map((item, index) => (
          <View key={index} className="flex flex-row py-3 px-5">
            <Image
              source={{ uri: item?.resortImages[0]?.link }}
              className="w-20 h-20 rounded-md"
              alt="image"
            />
            <View className="flex flex-col">
              <Text>{item.resortName}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ListResort;
