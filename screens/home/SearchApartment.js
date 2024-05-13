import { AntDesign } from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import SearchAdressBottomSheet from "../../components/Home/SearchAdressBottomSheet";
import SearchDateBottomSheet from "../../components/Home/SearchDateBottomSheet";
import InputGuestBottomSheet from "../../components/Home/InputGuestBottomSheet";
import SearchResortBottomSheet from "../../components/Home/SearchResortBottomSheet";
import { ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { submitSearchParamApartmentForRent } from "../../redux/actions/searchParamActions";
import { getListResort } from "../../redux/actions/resortActions";
import {
  getApartments,
  getSearchApartmentParams,
} from "../../redux/actions/apartmentActions";
import { SEARCH_APARTMENT_RESET } from "../../redux/constants/apartmentConstants";

export default function SearchApartment(props) {
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const handlerChamge = () => {};
  const [locationName, setLocationName] = useState("");
  const { searchParams } = useSelector((state) => state.searchApartmentParams);
  const [resortId, setResortId] = useState(searchParams.resortId);
  const [checkIn, setCheckIn] = useState(searchParams.checkIn);
  const [checkOut, setCheckOut] = useState(searchParams.checkOut);
  const [numberGuest, setNumberGuest] = useState(searchParams.numberOfGuest);
  const [pageNo, setPageNo] = useState(0);
  const { aparments } = useSelector((state) => state.apartments);

  const submitSearch = () => {
    if (searchParams) {
      dispatch(
        getApartments(
          searchParams?.resortId,
          searchParams?.checkIn,
          searchParams?.checkOut,
          searchParams?.numberOfGuest
        )
      );
      navigation.navigate("root");
    }
  };

  useEffect(() => {
    if (resortId || checkIn || checkOut || numberGuest) {
      dispatch(
        getSearchApartmentParams(resortId, checkIn, checkOut, numberGuest)
      );
    }
  }, [resortId, checkIn, checkOut, numberGuest]);

  const handleChangeResort = (value) => {
    setResortId(value);
  };

  console.log("Check resortId ", resortId);
  console.log("Check guest", numberGuest);
  console.log("Check out", checkOut);
  console.log("Check in", checkIn);

  const onClearForm = () => {
    dispatch({ type: SEARCH_APARTMENT_RESET });
    setPageNo(0);
  };
  return (
    <View className="bg-white flex-1">
      <View className="bg-blue-500 w-full h-[100px]  flex flex-row items-center justify-start px-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={30} color="white" />
        </TouchableOpacity>
        <Text className="ml-8 text-[20px] text-white">Search Home</Text>
      </View>
      {/* <Button title="Press me" onPress={() => handleSetTestData("asdsad")} /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 mt-5 py-5">
          {/* <SearchAdressBottomSheet setLocationName={setLocationName} /> */}
          <SearchResortBottomSheet handleChangeResort={handleChangeResort} />
          <SearchDateBottomSheet
            setCheckIn={setCheckIn}
            setCheckOut={setCheckOut}
          />
          <InputGuestBottomSheet setNumberGuest={setNumberGuest} />
        </View>
      </ScrollView>
      <View className="flex flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-400 fixed w-full">
        {/* <TouchableOpacity onPress={onClearForm}>
          <Text className="font-bold underline text-black">Clear all</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => submitSearch()}
          className="py-3 px-8 rounded-md bg-sky-500"
        >
          <Text className="text-white text-center font-bold text-lg">
            Search
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
