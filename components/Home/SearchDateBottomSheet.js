import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { View } from "react-native-animatable";
import { BottomSheet } from "react-native-btr";
import { AntDesign, EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import InputDateComponents from "../dateInput/InputDateComponents";
import { format } from "date-fns";
import InputDateSearch from "./InputDateSearch";
import { useSelector } from "react-redux";

export default function SearchDateBottomSheet(props) {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { searchParams } = useSelector((state) => state.searchApartmentParams);

  const initialDateRange = {
    startDate: searchParams.checkIn
      ? new Date(searchParams.checkIn)
      : new Date(),
    endDate: searchParams.checkOut
      ? new Date(searchParams.checkOut)
      : new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  };
  const [dateRange, setDateRange] = useState(initialDateRange);

  const handleDateRange = (value) => {
    setDateRange(value);
  };
  const handleFishnish = () => {
    props.setCheckIn(dateRange.startDate);
    props.setCheckOut(dateRange.endDate);
    setVisible(!visible);
  };
  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };

  return (
    <View className="">
      <View style={styles.shadow} className="bg-white rounded-xl px-5 mt-5 ">
        <TouchableOpacity
          onPress={() => toggleBottomNavigationView()}
          className="py-5 flex flex-row justify-between"
        >
          <Text>Time:</Text>
          <Text className="font-bold">
            {dateRange
              ? `${format(
                  new Date(dateRange.startDate),
                  "E, dd MMM"
                )} - ${format(new Date(dateRange.endDate), "E, dd MMM")}`
              : "Time"}
          </Text>
        </TouchableOpacity>
      </View>
      <BottomSheet
        visible={visible}
        onBackButtonPress={toggleBottomNavigationView}
        onBackdropPress={toggleBottomNavigationView}
      >
        <View style={styles.bottomNavigationView}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <View className="flex-1 px-4">
              <InputDateSearch
                dateRange={dateRange}
                handleDateRange={handleDateRange}
              />
            </View>

            <View className="pb-4 px-4">
              <TouchableOpacity
                onPress={() => handleFishnish()}
                className="w-full p-4 bg-sky-500 rounded-md"
              >
                <Text className="text-white text-lg text-center">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: "80%",
  },
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
