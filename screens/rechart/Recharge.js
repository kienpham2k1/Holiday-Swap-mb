import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { Checkbox } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { depositPoint } from "../../redux/actions/depositeActions";
import { DEPOSIT_RESET } from "../../redux/constants/depositConstants";
import axios from "axios";

export default function Recharge() {
  const [checked, setChecked] = React.useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedView, setSelectedView] = useState(null);
  const [pricePoint, setPricePoint] = useState();
  const [amountTotal, setAmountTotal] = useState();
  const [totalPoint, setTotalPoint] = useState(100);
  const { deposit, statusDeposit } = useSelector((state) => state.deposit);

  useFocusEffect(
    useCallback(async () => {
      const point = await axios.get("https://holiday-swap.click/api/v1/point");
      if (point) {
        setPricePoint(point.data.pointPrice);
      }
    }, [])
  );

  const onInputchange = (text) => {
    console.log("change change", text);
    setTotalPoint(text);
    setAmountTotal(Number(text) * Number(pricePoint));
  };

  const handleViewSelect = (viewId, selectedAmount) => {
    // Toggle selection on/off
    if (selectedView === viewId) {
      setSelectedView(null);
      setTotalPoint(null);
      setAmountTotal(null);
    } else {
      setSelectedView(viewId);
      setTotalPoint(selectedAmount.toString());
      setAmountTotal(selectedAmount * pricePoint);
    }
  };

  const RechargeSubmit = () => {
    dispatch(
      depositPoint(
        amountTotal,
        "nap tien vnpay",
        "https://holiday-swap.vercel.app/recharge/success",
        navigation
      )
    );
    navigation.navigate("VNPAYPayment");
  };

  useEffect(() => {
    if (statusDeposit) {
      console.log("Check it run", deposit);
      navigation.navigate("VNPAYPayment");
    }
  }, [statusDeposit, navigation]);

  return (
    <View className="bg-white h-full">
      <View className="bg-blue-500 w-full h-[100px]  flex flex-row items-center justify-start px-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text className="ml-8 text-[20px] text-white">Recharge</Text>
      </View>

      <ScrollView>
        <View className="px-4 bg-white  py-4">
          <View className="flex flex-row items-center justify-center gap-10 ">
            <TouchableOpacity
              className={`border py-4 px-10 ${
                selectedView === 1 ? "border-red-500" : "border-gray-300"
              }`}
              onPress={() => handleViewSelect(1, 100)}
            >
              <View>
                <Text className="text-[15px] font-bold">100 point</Text>
                <View className="flex flex-row items-center">
                  <Text>{100 * pricePoint}đ </Text>
                  <FontAwesome5 name="coins" size={15} color="orange" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={`border py-4 px-10 ${
                selectedView === 2 ? "border-red-500" : "border-gray-300"
              }`}
              onPress={() => handleViewSelect(2, 200)}
            >
              <View>
                <Text className="text-[15px] font-bold">200 point</Text>
                <View className="flex flex-row items-center">
                  <Text>{200 * pricePoint}đ </Text>
                  <FontAwesome5 name="coins" size={15} color="orange" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View className="flex flex-row items-center justify-center gap-10 mt-1">
            <TouchableOpacity
              className={`border py-4 px-10 ${
                selectedView === 3 ? "border-red-500" : "border-gray-300"
              }`}
              onPress={() => handleViewSelect(3, 500)}
            >
              <View>
                <Text className="text-[15px] font-bold">500 point</Text>
                <View className="flex flex-row items-center">
                  <Text>{500 * pricePoint}đ </Text>
                  <FontAwesome5 name="coins" size={15} color="orange" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={`border py-4 px-10 ${
                selectedView === 4 ? "border-red-500" : "border-gray-300"
              }`}
              onPress={() => handleViewSelect(4, 800)}
            >
              <View>
                <Text className="text-[15px] font-bold">800 point</Text>
                <View className="flex flex-row items-center">
                  <Text>{800 * pricePoint}đ </Text>
                  <FontAwesome5 name="coins" size={15} color="orange" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="bg-white  rounded-md">
          <View className="bg-gray-200 h-[10px] w-full my-3"></View>
        </View>
        <View className="px-4 mt-3 rounded-md bg-white ">
          <View className="bg-white ">
            <Text className="py-3 text-[20px] font-bold">
              Load points into HolidaySwap
            </Text>
            <View>
              <Text>Enter the amount to deposit</Text>
              <TextInput
                onChangeText={(text) => onInputchange(text)}
                value={totalPoint}
                placeholder="point"
                keyboardType="numeric"
                className="px-3 mt-2 rounded-lg py-3 border border-gray-300"
              />
              <View className="flex flex-row items-center justify-center gap-3 mt-4">
                <Text>{totalPoint ? `${totalPoint} point` : ""}</Text>
                <Text>=</Text>
                <View className="flex flex-row">
                  <Text>{amountTotal} đ </Text>
                  <FontAwesome5 name="coins" size={15} color="orange" />
                </View>
              </View>
            </View>
            <View className="flex flex-row items-center w-full justify-center mt-5 mb-5">
              <TouchableOpacity
                onPress={RechargeSubmit}
                className="bg-blue-500 px-20 py-3 rounded-md"
              >
                <Text className="text-white">Recharge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
