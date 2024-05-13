import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  TextInput,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native";
import { Text, CheckBox } from "react-native";
import { View } from "react-native-animatable";
import { Checkbox } from "react-native-paper";
import { StarIcon } from "react-native-heroicons/solid";
import {
  PlusCircleIcon,
  MinusCircleIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { BottomSheet } from "react-native-btr";
import InputDateComponents from "../../components/dateInput/InputDateComponents";
import { differenceInDays, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { createBooking } from "../../redux/actions/bookingActions";
import { loadUser } from "../../redux/actions/userActions";
import { useEffect } from "react";
import ModalConfirmBooking from "../../components/modal/ModalConfirmBooking";
import { CREATE_BOOKING_RESET } from "../../redux/constants/bookingConstants";
import { Fragment } from "react";
import Loading from "../../components/Loading";
import validator from "validator";
import ModalConfirmBase from "./../../components/modal/ModalConfirmBase";
import Toast from "react-native-toast-message";
// import { TouchableOpacity } from "react-native-gesture-handler";

export default function InputInfomationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { apartmentBooking } = route.params;
  const [checked, setChecked] = React.useState(false);
  const [checkedA, setCheckedA] = React.useState(false);
  const [checkedB, setCheckedB] = React.useState(false);
  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const [visibleGuest, setVisibleGuest] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  const [apartmentAllowGuest, setApartmentAllowGuest] = useState(
    apartmentBooking?.property?.numberKingBeds * 2 +
      apartmentBooking?.property?.numberQueenBeds * 2 +
      apartmentBooking?.property?.numberSingleBeds +
      apartmentBooking?.property?.numberDoubleBeds * 2 +
      apartmentBooking?.property?.numberTwinBeds * 2 +
      apartmentBooking?.property?.numberFullBeds * 2 +
      apartmentBooking?.property?.numberSofaBeds +
      apartmentBooking?.property?.numberMurphyBeds
  );

  const [adultsGuest, setAdultsGuest] = useState(1);
  const [childrenGuest, setChildrenGuest] = useState(0);
  const [totalGuest, setTotalGuest] = useState(1);
  const { loading, success, error, booking } = useSelector(
    (state) => state.newBooking
  );
  const { user, userProfile } = useSelector((state) => state.user);
  const { dateRangeBooking: dateRangeRedux } = useSelector(
    (state) => state.dateRangeBooking
  );
  const dispatch = useDispatch();

  const toggleVisibleCalendar = () => {
    setVisibleCalendar(!visibleCalendar);
  };

  const toggleVisibleGuest = () => {
    setVisibleGuest(!visibleGuest);
  };

  const handleVisibleModal = () => {
    setVisibleModal(!visibleModal);
  };

  const [items, setItems] = useState([1]);
  const [clickedButtons, setClickedButtons] = useState([]);
  const [guests, setGuests] = useState([
    { email: "", fullName: "", phoneNumber: "" },
  ]);

  const addGuest = () => {
    setGuests([...guests, { email: "", fullName: "", phoneNumber: "" }]);
  };

  const addItem = () => {
    const newItem = items.length + 1;
    setItems([...items, newItem]);
  };

  const handleButtonClick = (item) => {
    if (!clickedButtons.includes(item)) {
      setClickedButtons([...clickedButtons, item]);
    }
  };

  // const handleChangeDateRangeBooking = (value) => {
  //   setDateRangeBooking(value);
  // };

  const handleDescreaseAdultGuest = (value) => {
    if (value <= 1) {
      return 1;
    }

    setAdultsGuest(value - 1);
    setTotalGuest(totalGuest - 1);
  };

  const handleInscreaseAdultGuest = (value) => {
    if (
      value >= apartmentAllowGuest ||
      value + childrenGuest >= apartmentAllowGuest
    ) {
      return value;
    }

    setAdultsGuest(value + 1);
    setTotalGuest(totalGuest + 1);
  };

  const handldeDescreaseChildrenGuest = (value) => {
    if (value <= 0) {
      return 0;
    }

    setChildrenGuest(value - 1);
    setTotalGuest(totalGuest - 1);
  };

  const handleInscreaseChildrenGuest = (value) => {
    if (
      value >= apartmentAllowGuest ||
      value + adultsGuest >= apartmentAllowGuest
    ) {
      return value;
    }

    setChildrenGuest(value + 1);
    setTotalGuest(totalGuest + 1);
  };

  const calculateNightDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nightDifference = differenceInDays(end, start);
    return nightDifference;
  };

  const handleGuestInfoChange = (text, field, guestIndex) => {
    setGuests((prevGuests) => {
      const updatedGuests = [...prevGuests];
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        [field]: text,
      };

      return updatedGuests;
    });
  };

  const isEmailValid = (email) => {
    return validator.isEmail(email) && email.endsWith("@gmail.com");
  };

  const handleBooking = () => {
    // const isAllEmailValid = guests.every((guest) => isEmailValid(guest.email));

    // if (!isAllEmailValid) {
    //   // Hiển thị thông báo khi có ít nhất một email không hợp lệ
    //   Alert.alert("Warning", "Please enter a valid email");
    //   return;
    // }
    // const isPhoneNumberValid = guests.every((guest) =>
    //   /^[0-9]{10}$/.test(guest.phoneNumber)
    // );

    // if (!isPhoneNumberValid) {
    //   // Display an alert if the phone number format is invalid
    //   Alert.alert(
    //     "Warning",
    //     "Please enter a valid 10-digit phone number starting with 0"
    //   );
    //   return;
    // }

    dispatch(
      createBooking(
        apartmentBooking.availableTime.id,
        userProfile.userId,
        dateRangeRedux.startTimeBooking,
        dateRangeRedux.endTimeBooking,
        guests
      )
    );
  };

  useEffect(() => {
    if (error) {
      setVisibleModal(false);
      Toast.show({
        type: "error",
        text1: "Booking",
        text2: error,
      });
      dispatch({ type: CREATE_BOOKING_RESET });
    }

    if (success) {
      setVisibleModal(false);
      dispatch({ type: CREATE_BOOKING_RESET });
      navigation.navigate("BookingConfirm", {
        apartmentBooking: apartmentBooking,
        // dateRangeBooking: dateRangeRedux,
        total:
          apartmentBooking?.availableTime?.pricePerNight *
          calculateNightDifference(
            dateRangeRedux.startTimeBooking,
            dateRangeRedux.endTimeBooking
          ),
      });
    }
  }, [error, success, dispatch, navigation, dateRangeRedux, apartmentBooking]);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <View className="flex-1">
          <View className="bg-blue-500 w-full h-[100px]  flex flex-row items-center justify-start px-5">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={30} color="white" />
            </TouchableOpacity>
            <Text className="ml-8 text-[20px] text-white">Confirm and pay</Text>
          </View>
          <ScrollView className="flex-1">
            <View className="flex flex-row gap-3 bg-white px-4 py-5">
              <Image
                source={{
                  uri: `${apartmentBooking?.availableTime?.coOwner?.property?.propertyImages[0].link}`,
                }}
                className="h-40 w-44 rounded-lg"
              />

              <View className="flex flex-col justify-evenly w-[50%]">
                <View>
                  <Text className="text-[15px] font-bold ">Resort: </Text>
                  <Text className="w-[80%]">
                    {
                      apartmentBooking?.availableTime?.coOwner?.property?.resort
                        .resortName
                    }
                  </Text>
                </View>
                <View>
                  <Text className="text-[15px] font-bold">Property:</Text>
                  <Text className=" w-[90%]">
                    {
                      apartmentBooking?.availableTime?.coOwner?.property
                        ?.propertyName
                    }
                  </Text>
                </View>
                <View className="flex flex-row items-center">
                  <Text className="font-bold">Apartment ID: </Text>
                  <Text className="">
                    {apartmentBooking?.availableTime?.coOwner?.id}
                  </Text>
                </View>
                {/* <Text className=" font-normal">
                  {apartmentBooking?.property?.propertyDescription}
                </Text> */}

                {/* <Text className="flex flex-row gap-1 items-center ">
                  <StarIcon size={30} color={"yellow"} />
                  <Text>4.92</Text>
                </Text> */}
              </View>
            </View>

            <View className="bg-white w-full py-5 px-5 mt-2">
              <Text className="text-xl py-4 font-bold">Your trip</Text>
              <View className="py-3 flex flex-row justify-between items-center">
                <View className="flex flex-col">
                  <Text className="text-lg font-bold">Dates</Text>
                  <Text className="text-slate-700">
                    {format(
                      new Date(dateRangeRedux?.startTimeBooking),
                      "d, MMM yyyy"
                    )}{" "}
                    -{" "}
                    {format(
                      new Date(dateRangeRedux?.endTimeBooking),
                      "d, MMM yyyy"
                    )}
                  </Text>
                </View>
                <Text
                  onPress={toggleVisibleCalendar}
                  className="text-lg underline font-bold"
                >
                  Edit
                </Text>
              </View>

              <BottomSheet
                visible={visibleCalendar}
                onBackButtonPress={toggleVisibleCalendar}
                onBackdropPress={toggleVisibleCalendar}
              >
                <View style={styles.bottomNavigationViewCalendar}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <View className="flex-1 px-4">
                      <View className="py-3 border-b border-gray-300 flex flex-row gap-9 items-center">
                        <XMarkIcon
                          onPress={toggleVisibleCalendar}
                          size={30}
                          color={"black"}
                        />
                        <Text className="text-xl font-bold text-black">
                          Dates
                        </Text>
                      </View>
                      <InputDateComponents />
                    </View>

                    <View className="pb-4 px-4  flex flex-row justify-end bg-white shadow-md">
                      <TouchableOpacity
                        onPress={() => setVisibleCalendar(!visibleCalendar)}
                        className="w-[40%] p-4 bg-sky-500 rounded-md"
                      >
                        <Text className="text-white text-lg text-center">
                          Apply
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </BottomSheet>

              <View className="py-3 flex flex-row justify-between">
                <View className="flex flex-col">
                  <Text className="text-lg font-bold">Guests</Text>
                  <Text className="text-slate-700 text-base">
                    {totalGuest === 1
                      ? `${totalGuest} guest`
                      : `${totalGuest} guests`}
                  </Text>
                </View>
                <Text
                  onPress={toggleVisibleGuest}
                  className="text-lg underline font-bold"
                >
                  Edit
                </Text>
              </View>
            </View>

            <View className="bg-white w-full py-5 px-5 mt-2">
              <Text className="text-lg  font-bold">Price details</Text>
              <View className="mt-3">
                <View className="flex flex-row items-center gap-2 mb-2">
                  <View className="flex flex-row items-center  ">
                    <Text className="text-lg font-bold mr-1">
                      {apartmentBooking?.availableTime?.pricePerNight}
                    </Text>
                    <FontAwesome5 name="coins" size={15} color="orange" />
                  </View>
                  <Text className="text-lg font-bold">/</Text>
                  <Text className="font-bold">Night</Text>
                </View>
                <View className="pb-3 flex flex-row justify-between items-center">
                  <View className=" flex flex-row items-center gap-2 ">
                    <Text className="text-lg font-bold">
                      {apartmentBooking?.availableTime?.pricePerNight}{" "}
                      <FontAwesome5 name="coins" size={15} color="orange" />
                    </Text>
                    <Text className="text-lg">x</Text>
                    <View className=" flex flex-row items-center gap-1">
                      <Text className="text-lg font-bold">
                        {calculateNightDifference(
                          dateRangeRedux.startTimeBooking,
                          dateRangeRedux.endTimeBooking
                        )}
                      </Text>
                      <Text className="text-lg font-bold">night</Text>
                    </View>
                  </View>
                  <View className="flex flex-row items-center gap-2">
                    <Text className="text-lg font-bold">
                      {apartmentBooking?.availableTime?.pricePerNight *
                        calculateNightDifference(
                          dateRangeRedux.startTimeBooking,
                          dateRangeRedux.endTimeBooking
                        )}
                    </Text>
                    <FontAwesome5 name="coins" size={15} color="orange" />
                  </View>
                </View>
              </View>
            </View>

            <BottomSheet
              visible={visibleGuest}
              onBackButtonPress={toggleVisibleGuest}
              onBackdropPress={toggleVisibleGuest}
            >
              <View style={styles.bottomNavigationViewGuest}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingVertical: 20,
                  }}
                >
                  <View className="flex-1 px-4">
                    <View className="py-3 border-b border-gray-300 flex flex-row gap-9 items-center">
                      <XMarkIcon
                        onPress={toggleVisibleGuest}
                        size={30}
                        color={"black"}
                      />
                      <Text className="text-xl font-bold text-black">
                        Guests
                      </Text>
                    </View>
                    <View className="flex flex-row justify-between py-4">
                      <View className="flex flex-col gap-1">
                        <Text className="text-xl font-bold text-black">
                          Adults
                        </Text>
                        <Text className="text-base text-slate-800">
                          Age 13+
                        </Text>
                      </View>
                      <View className="flex flex-row gap-3 items-center">
                        <MinusCircleIcon
                          onPress={() => handleDescreaseAdultGuest(adultsGuest)}
                          color={adultsGuest <= 1 ? "gray" : "black"}
                          size={35}
                        />
                        <Text className="text-xl">{adultsGuest}</Text>
                        <PlusCircleIcon
                          onPress={() => handleInscreaseAdultGuest(adultsGuest)}
                          color={
                            totalGuest >= apartmentAllowGuest ? "gray" : "black"
                          }
                          size={35}
                        />
                      </View>
                    </View>

                    <View className="flex flex-row justify-between py-4">
                      <View className="flex flex-col gap-1">
                        <Text className="text-xl font-bold text-black">
                          Children
                        </Text>
                        <Text className="text-base text-slate-800">
                          Ages 2 - 12
                        </Text>
                      </View>
                      <View className="flex flex-row gap-3 items-center">
                        <MinusCircleIcon
                          onPress={() =>
                            handldeDescreaseChildrenGuest(childrenGuest)
                          }
                          color={childrenGuest <= 0 ? "gray" : "black"}
                          size={35}
                        />
                        <Text className="text-xl">{childrenGuest}</Text>
                        <PlusCircleIcon
                          onPress={() =>
                            handleInscreaseChildrenGuest(childrenGuest)
                          }
                          color={
                            totalGuest >= apartmentAllowGuest ? "gray" : "black"
                          }
                          size={35}
                        />
                      </View>
                    </View>
                  </View>

                  <View className="pb-4 px-4  flex flex-row justify-end bg-white shadow-md">
                    <TouchableOpacity
                      onPress={() => setVisibleGuest(!visibleGuest)}
                      className="w-[40%] p-4 bg-sky-500 rounded-md"
                    >
                      <Text className="text-white text-lg  text-center">
                        Apply
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </BottomSheet>
            <View className="mt-2">
              {/* <View className="bg-white mb-2 px-2 rounded-md mt-2">
            <View className="py-4">
              <Text className="font-bold text-[18px]">Booking for?</Text>
            </View>
            <View className="mb-4">
              <View className="flex flex-row pt-2">
                <Text className="">Last Name</Text>
                <Text className="text-red-700">*</Text>
              </View>
              <View className="mt-2">
                <TextInput
                  className="border border-gray-500 px-2 py-3 rounded-md"
                  placeholder="Your name"
                />
              </View>
            </View>
            <View className="mb-4">
              <View className="flex flex-row">
                <Text>First name</Text>
                <Text className="text-red-700">*</Text>
              </View>
              <View className="mt-2">
                <TextInput
                  className="border border-gray-500 px-2 py-3 rounded-md"
                  placeholder="Your name"
                />
              </View>
            </View>
            <View className="mb-4">
              <View className="flex flex-row">
                <Text>Email adress</Text>
                <Text className="text-red-700">*</Text>
              </View>
              <View className="mt-2">
                <TextInput
                  className="border border-gray-500 px-2 py-3 rounded-md"
                  placeholder="Buitrithuc1008@gmail.com"
                />
              </View>
            </View>

            <View className="mb-4">
              <View className="flex flex-row">
                <Text>Phone</Text>
                <Text className="text-red-700">*</Text>
              </View>
              <View className="mt-2">
                <TextInput
                  className="border border-gray-500 px-2 py-3 rounded-md"
                  value="0856597778"
                />
              </View>
            </View>
          </View> */}
              <View className="bg-white px-4">
                <Text className="font-bold text-lg py-3">
                  Guest information
                </Text>

                <View className="bg-white px-2 rounded-md">
                  {guests.map((item, index) => (
                    <View key={index}>
                      <Text className="pb-3 font-bold" Ư>
                        {index + 1}
                      </Text>
                      <View className="mb-4">
                        <View className="flex flex-row">
                          <Text>Full Name</Text>
                          <Text className="text-red-700">*</Text>
                        </View>
                        <View className="mt-2">
                          <TextInput
                            onChangeText={(text) =>
                              handleGuestInfoChange(text, "fullName", index)
                            }
                            defaultValue={
                              index === 0 ? userProfile?.fullName : ""
                            }
                            className="border border-gray-500 px-2 py-3 rounded-md"
                            placeholder="Your name"
                          />
                        </View>
                      </View>
                      <View className="mb-4">
                        <View className="flex flex-row">
                          <Text>Phone</Text>
                          <Text className="text-red-700">*</Text>
                        </View>
                        <View className="mt-2">
                          <TextInput
                            keyboardType="numeric"
                            onChangeText={(text) =>
                              handleGuestInfoChange(text, "phoneNumber", index)
                            }
                            defaultValue={index === 0 ? userProfile?.phone : ""}
                            className="border border-gray-500 px-2 py-3 rounded-md"
                            placeholder="Phone number"
                          />
                        </View>
                      </View>
                      <View className="mb-4">
                        <View className="flex flex-row">
                          <Text>Email</Text>
                          <Text className="text-red-700">*</Text>
                        </View>
                        <View className="mt-2">
                          <TextInput
                            onChangeText={(text) =>
                              handleGuestInfoChange(text, "email", index)
                            }
                            defaultValue={index === 0 ? userProfile?.email : ""}
                            className="border border-gray-500 px-2 py-3 rounded-md"
                            placeholder="Email"
                          />
                        </View>
                        {/* Thêm thông báo lỗi nếu email không hợp lệ */}
                        {!isEmailValid(item.email) && (
                          <Text className="text-red-700"></Text>
                        )}
                      </View>
                      {totalGuest <= 1 || guests.length === Number(totalGuest)
                        ? ""
                        : !clickedButtons.includes(item) && (
                            <TouchableOpacity
                              className="flex flex-row gap-5 justify-end mb-3"
                              onPress={() => {
                                addGuest();
                                handleButtonClick(item);
                              }}
                            >
                              <AntDesign name="pluscircleo" size={25} />
                            </TouchableOpacity>
                          )}
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <ModalConfirmBase
              context={"Are you sure want to booking?"}
              modalVisible={visibleModal}
              setModalVisible={setVisibleModal}
              onPress={handleBooking}
            />
          </ScrollView>
          <View className="border-t bg-white border-gray-300 flex flex-row items-center justify-between px-3 h-16">
            <View className="w-[48%]">
              <View className="flex flex-row items-center">
                <Text className="text-[25px] font-bold">Total: </Text>
                <Text className="text-[25px] font-bold mr-1">
                  {apartmentBooking?.availableTime?.pricePerNight *
                    calculateNightDifference(
                      dateRangeRedux.startTimeBooking,
                      dateRangeRedux.endTimeBooking
                    )}
                </Text>
                <FontAwesome5 name="coins" size={20} color="orange" />
              </View>
            </View>
            <View className="w-[48%]">
              <TouchableOpacity
                onPress={() => setVisibleModal(true)}
                className="bg-blue-500 py-3 rounded-md"
              >
                <Text className="text-white text-2xl text-center">Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {},
  bottomNavigationViewCalendar: {
    backgroundColor: "#fff",
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  bottomNavigationViewGuest: {
    backgroundColor: "#fff",
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
