import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelBooking,
  getBookingDetails,
  getOwnerBookingDetails,
} from "../../redux/actions/bookingActions";
import { Ionicons, EvilIcons, Octicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { format } from "date-fns";
import ReviewBtn from "../../components/review/ReviewBtn";
import Loading from "../../components/Loading";
import { StatusBar } from "expo-status-bar";
import { BottomSheet } from "react-native-btr";
import { XMarkIcon } from "react-native-heroicons/solid";
import DropDownPicker from "react-native-dropdown-picker";
import {
  createRatingBooking,
  getRatingBooking,
} from "../../redux/actions/ratingActions";
import {
  createConversation,
  getConversation,
  loadUser,
  searchUserByEmail,
} from "../../redux/actions/userActions";
import Toast from "react-native-toast-message";
import { CANCEL_BOOKING_RESET } from "../../redux/constants/bookingConstants";
import ModalConfirmBase from "../../components/modal/ModalConfirmBase";
import { CREATE_CONVERSATION_RESET } from "../../redux/constants/userConstants";

export default function OwnerBookingDetail() {
  const route = useRoute();
  const [visibleGuest, setVisibleGuest] = useState(false);
  const [visibleRating, setVisibleRating] = useState(false);
  const { id } = route.params;
  const dispatch = useDispatch();
  const { booking, loading } = useSelector((state) => state.bookingDetail);
  const { ratings } = useSelector((state) => state.ratings);
  const { userProfile } = useSelector((state) => state.user);
  const { userEmail } = useSelector((state) => state.userEmail);
  const { success, error } = useSelector((state) => state.createRatingBooking);
  const {
    success: createConSuccess,
    error: createConError,
    conversation,
  } = useSelector((state) => state.createConversation);

  const {
    success: getConSuccess,
    error: getConError,
    conversationUser,
  } = useSelector((state) => state.getConversation);

  const { successCancel, error: errorCancel } = useSelector(
    (state) => state.cancelBooking
  );
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      dispatch(getOwnerBookingDetails(id));
      dispatch(getRatingBooking(id));
    }, [dispatch, id])
  );

  useFocusEffect(
    useCallback(() => {
      if (booking) {
        dispatch(searchUserByEmail(booking?.memberBookingEmail));
      }
    }, [booking, dispatch])
  );

  const handleCancelBooking = () => {
    dispatch(cancelBooking(id));
  };

  const toggleBottomNavigationGuest = () => {
    setVisibleGuest(!visibleGuest);
  };

  const toggleBottomNavigationRating = () => {
    setVisibleRating(!visibleRating);
  };

  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [comment, setComment] = useState("");
  const [items, setItems] = useState([
    { label: "Public", value: "PUBLIC" },
    { label: "Anonymous", value: "PRIVATE" },
  ]);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const [visibleModal, setVisibleModal] = useState(false);

  const handleSubmitReview = () => {
    const data = {
      comment: comment,
      rating: Number(rating),
      ratingType: value,
    };
    dispatch(createRatingBooking(userProfile.userId, id, data));
    setVisibleRating(false);
  };

  useEffect(() => {
    if (successCancel) {
      Toast.show({
        type: "success",
        text1: "Cancel booking",
        text2: "Cancel booking successfully!",
      });
      setVisibleModal(false);
      dispatch(getOwnerBookingDetails(id));
      dispatch({ type: CANCEL_BOOKING_RESET });
    }

    if (errorCancel) {
      Toast.show({
        type: "error",
        text1: "Cancel booking",
        text2: errorCancel,
      });
      setVisibleModal(false);
      dispatch({ type: CANCEL_BOOKING_RESET });
    }
  }, [successCancel, errorCancel, dispatch]);

  const handleCreateConversation = () => {
    if (userEmail) {
      dispatch(getConversation(userEmail?.content[0]?.userId));
      dispatch(createConversation(userEmail?.content[0]?.userId));
    }
  };

  useEffect(() => {
    if (getConSuccess && createConError) {
      dispatch({ type: CREATE_CONVERSATION_RESET });
      navigation.navigate("ChatScreen");
    }

    if (getConError && createConSuccess) {
      dispatch({ type: CREATE_CONVERSATION_RESET });
      navigation.navigate("ChatScreen");
    }

    if (createConError && getConError) {
      Toast.show({
        type: "error",
        text1: "Contact",
        text2: createConError || getConError,
      });
      dispatch({ type: CREATE_CONVERSATION_RESET });
    }
  }, [
    createConSuccess,
    createConError,
    dispatch,
    navigation,
    getConSuccess,
    getConError,
  ]);

  return (
    <Fragment>
      {loading ? (
        <View className="flex-1">
          <Loading />
        </View>
      ) : (
        <SafeAreaView className="flex-1">
          <StatusBar style="light" hidden={false} animated />
          <ScrollView className="h-full">
            <Image
              className="w-full h-[300px] relative"
              source={{ uri: booking?.propertyImage }}
            />
            <View className="absolute  w-full h-[300px] px-4 flex flex-col bg-neutral-800/70">
              <TouchableOpacity
                className="pt-10"
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back-circle" size={50} color="white" />
              </TouchableOpacity>
              <View className="mt-8">
                <Text className="text-2xl text-white font-bold">
                  Your guests will arrive{" "}
                  <Text className="font-bold">{booking?.resortName}</Text>{" "}
                </Text>
              </View>
            </View>

            <View className="px-3">
              <View className="flex flex-row justify-around pt-6 pb-3 border-b border-slate-300">
                <View className="flex flex-col">
                  <Text className="font-bold text-base">Check-in</Text>
                  {booking?.dateCheckIn && (
                    <Text>
                      {format(new Date(booking?.dateCheckIn), "MMMM d, yyyy")}
                    </Text>
                  )}
                  <Text>2PM</Text>
                </View>
                <View className="border-r border-slate-300"></View>
                <View className="flex flex-col items-start">
                  <Text className="font-bold text-base">Check-out</Text>
                  {booking?.dateCheckOut && (
                    <Text>
                      {format(new Date(booking?.dateCheckOut), "MMMM d, yyyy")}
                    </Text>
                  )}
                  <Text>12PM</Text>
                </View>
              </View>

              {userEmail &&
                userEmail.content &&
                userEmail.content.length > 0 && (
                  <View className="flex flex-row justify-between items-center  pt-4 pb-4 border-b border-slate-300">
                    <View className="flex flex-row items-center gap-1">
                      <View>
                        <Image
                          source={
                            userEmail?.content[0]?.avatar
                              ? { uri: userEmail?.content[0]?.avatar }
                              : require("../../assets/images/avatar.png")
                          }
                          className="rounded-full w-10 h-10"
                        />
                      </View>
                      <View className="flex flex-col ">
                        <Text className="text-lg font-bold">
                          Member's booking
                        </Text>
                        <Text className="text base">
                          {userEmail?.content[0]?.fullName
                            ? userEmail?.content[0]?.fullName
                            : userEmail?.content[0]?.username}
                        </Text>
                      </View>
                    </View>
                    <View className="flex flex-row items-center  justify-center w-[42%]">
                      <TouchableOpacity
                        onPress={handleCreateConversation}
                        className="bg-blue-500 px-5 py-2 rounded-md my-3"
                      >
                        <Text className="text-white">Contact</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

              <View className="flex flex-col px-6 pt-4 pb-4 border-b border-slate-300">
                <Text className="text-lg font-bold">Name property</Text>
                <Text className="text-base">{booking?.propertyName}</Text>
              </View>

              <TouchableOpacity
                onPress={toggleBottomNavigationGuest}
                activeOpacity={0.7}
                className="flex flex-row justify-between items-center px-6 pt-4 pb-4 border-b border-slate-300"
              >
                <View className="flex flex-col">
                  <Text className="text-lg font-bold">Who's comming</Text>
                  <Text className="text-base">{booking?.numberOfGuest}</Text>
                </View>

                <Octicons name="chevron-right" size={24} color="black" />
              </TouchableOpacity>

              <View className="flex flex-col px-6 pt-4 pb-4 border-b border-slate-300">
                <Text className="text-lg font-bold">Total price</Text>
                <Text className="text-base">{booking?.price} point</Text>
              </View>

              {/* <TouchableOpacity
                onPress={toggleBottomNavigationRating}
                activeOpacity={0.7}
                className="flex flex-row justify-between items-center px-6 pt-4"
              >
                <View className="flex flex-col">
                  <Text className="text-lg font-bold">Rating</Text>
                </View>

                <Octicons name="chevron-right" size={24} color="black" />
              </TouchableOpacity> */}

              {booking?.canCancel === true && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setVisibleModal(true)}
                  className="mt-2 rounded-md px-6 py-3 my-5 border border-red-500"
                >
                  <Text className="text-lg text-red-500 text-center">
                    Cancel booking
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {/* Guest bottom sheet */}
          <BottomSheet
            visible={visibleGuest}
            onBackButtonPress={toggleBottomNavigationGuest}
            onBackdropPress={toggleBottomNavigationGuest}
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
                  <View className="py-3 border-b border-gray-300 flex flex-row gap-9 items-center">
                    <XMarkIcon
                      onPress={toggleBottomNavigationGuest}
                      size={30}
                      color={"black"}
                    />
                    <Text className="text-xl font-bold text-black">
                      Guest information
                    </Text>
                  </View>

                  {booking &&
                    booking.userOfBooking &&
                    booking.userOfBooking.length > 0 && (
                      <ScrollView className="pt-5">
                        <View className="flex flex-row">
                          <Text className="text-[16px]">Email: </Text>

                          <Text className="text-[18px] font-bold">
                            {booking?.userOfBooking[0].email}
                          </Text>
                        </View>

                        <View className="flex flex-row items-baseline">
                          <Text className="text-[16px]">Fullname: </Text>

                          <Text className="text-[18px] font-bold">
                            {booking?.userOfBooking[0].fullName}
                          </Text>
                        </View>

                        <View className="flex flex-row items-center">
                          <Text className="text-[16px]">Phone Number: </Text>

                          <Text className="text-[18px] font-bold">
                            {booking?.userOfBooking[0].phoneNumber}
                          </Text>
                        </View>
                      </ScrollView>
                    )}
                </View>

                <View className="pb-4 px-4  flex flex-row justify-end bg-white shadow-md">
                  <TouchableOpacity
                    onPress={() => setVisibleGuest(!visibleGuest)}
                    className="w-[100%] p-4 bg-sky-500 rounded-md"
                  >
                    <Text className="text-white text-lg text-center">
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BottomSheet>

          {/* Rating */}
          <BottomSheet
            visible={visibleRating}
            onBackButtonPress={toggleBottomNavigationRating}
            onBackdropPress={toggleBottomNavigationRating}
          >
            <View style={stylesRating.bottomNavigationView}>
              <View>
                <View className="py-3 border-b w-full border-gray-300 flex flex-row gap-9 items-center px-2">
                  <XMarkIcon
                    onPress={toggleBottomNavigationRating}
                    size={30}
                    color={"black"}
                  />
                  <Text className="text-xl font-bold text-black text-center">
                    Review
                  </Text>
                </View>
                {!ratings ? (
                  <View className="px-5 py-10">
                    <View>
                      <Text className="text-[20px] font-bold">Rating</Text>
                      <View className="flex flex-row items-center gap-1 py-5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <TouchableOpacity
                            key={star}
                            onPress={() => handleStarPress(star)}
                          >
                            <Octicons
                              name="star-fill"
                              size={30}
                              color={star <= rating ? "orange" : "gray"}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>

                      <View>
                        <Text className="text-[20px] font-bold">
                          Your comment
                        </Text>
                        <View className="py-3">
                          <TextInput
                            onChangeText={(text) => setComment(text)}
                            className="w-full h-[50px] border border-gray-500 rounded-md px-2"
                          />
                        </View>
                      </View>
                      <View>
                        <Text className="text-[20px] font-bold">
                          Do you want to remain anonymous?
                        </Text>
                        <View className="py-5">
                          <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View className="pt-5 px-4">
                    <View className="flex flex-row gap-3 items-center">
                      <Image
                        source={{ uri: ratings?.user?.avatar }}
                        className="rounded-full h-20 w-20"
                      />
                      <View>
                        <Text className="font-semibold text-base">
                          {ratings.ratingType !== "PRIVATE"
                            ? ratings?.user?.fullName
                            : `Anymous user`}
                        </Text>
                        {ratings?.createDate ? (
                          <Text>
                            {format(
                              new Date(ratings?.createDate),
                              "dd/MM/yyyy 'at' h:mm a"
                            )}
                          </Text>
                        ) : (
                          ""
                        )}
                      </View>
                    </View>

                    <View className="pt-4">
                      <Text className="text-lg font-semibold">
                        {ratings?.comment}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View className="absolute bottom-5 right-5">
                {!ratings ? (
                  <TouchableOpacity
                    onPress={handleSubmitReview}
                    className="bg-blue-500 rounded-md px-7 py-3"
                  >
                    <Text className="text-white">Submit</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={toggleBottomNavigationRating}
                    className="bg-blue-500 rounded-md px-7 py-3"
                  >
                    <Text className="text-white">Close</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </BottomSheet>

          <ModalConfirmBase
            context={"Are you sure want to cancel this booking?"}
            modalVisible={visibleModal}
            setModalVisible={setVisibleModal}
            onPress={handleCancelBooking}
          />
        </SafeAreaView>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {},
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: "80%",

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

const stylesRating = StyleSheet.create({
  container: {},
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
});
