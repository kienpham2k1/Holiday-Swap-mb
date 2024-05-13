import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { getHistoryBooking } from "../../redux/actions/historyBookingActions";
import Loading from "../../components/Loading";
import { format } from "date-fns";
import { StatusBar } from "expo-status-bar";

export default function YourTrip() {
  const dispatch = useDispatch();
  const { historyBooking, error, loading } = useSelector(
    (state) => state.historyBooking
  );

  const [isDataLoaded, setDataLoaded] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getHistoryBooking());
    }, [dispatch])
  );

  useEffect(() => {
    if (historyBooking || error) {
      setDataLoaded(true);
    }
  }, [historyBooking, error]);

  const navigation = useNavigation();

  return (
    <View className="flex-1">
      <StatusBar style="light" animated hidden={false} />
      <View className="bg-blue-500 w-full h-[100px] flex flex-row items-center justify-start px-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text className="ml-8 text-[20px] text-white">Your trip</Text>
      </View>
      <ScrollView className="">
        {loading && (
          <View className="mt-80">
            <Loading />
          </View>
        )}
        {isDataLoaded && !loading && (
          <>
            {historyBooking && historyBooking.length > 0 ? (
              historyBooking.map((booking, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate("BookingDetail", {
                      id: booking.bookingId,
                    })
                  }
                >
                  <View className="px-4 py-3 border-b border-gray-300">
                    <Image
                      source={{ uri: booking.propertyImage }}
                      style={{ width: "100%", height: 200 }}
                    />
                    <Text className="text-[20px] font-bold py-2">
                      {booking.propertyName}
                    </Text>
                    <View className="flex flex-row">
                      <Text>Resort: </Text>
                      <Text className="font-bold w-[85%]">
                        {booking.resortName}
                      </Text>
                    </View>
                    <View className="flex flex-row py-1">
                      <Text>Room: </Text>
                      <Text className="font-bold">{booking.roomId}</Text>
                    </View>
                    <View className="flex flex-row">
                      <Text>Check-in: </Text>
                      <Text className="font-bold">
                        {format(new Date(booking?.checkInDate), "dd-MM-yyyy")}
                      </Text>
                    </View>
                    <View className="flex flex-row py-1 ">
                      <Text>Check-out: </Text>
                      <Text className="font-bold">
                        {format(new Date(booking.checkOutDate), "dd-MM-yyyy")}
                      </Text>
                    </View>
                    <View className="flex flex-row items-center gap-1">
                      <Text>Price: {booking.price}</Text>
                      <FontAwesome5 name="coins" size={15} color="orange" />
                    </View>
                    <View className="flex flex-row items-center gap-1 pt-1">
                      <Text>Status:</Text>
                      <Text
                        className={`font-bold ${
                          booking.status === "SUCCESS"
                            ? "text-green-500"
                            : "text-orange-500"
                        }`}
                      >
                        {booking.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="px-4">
                <Text className="text-[20px] py-3 font-bold">
                  No trips have been booked yet... Still not.
                </Text>
                <Text className="w-[80%] text-[15px] py-3">
                  "It's time to dust off your luggage and start preparing for
                  your next adventure."
                </Text>
                <View className="w-[50%] mx-4 py-3">
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Home")}
                    className="px-5 py-3 border border-gray-600 rounded-md"
                  >
                    <Text className="text-center text-[20px] font-bold">
                      Start search
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
