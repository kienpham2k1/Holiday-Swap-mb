import React, { useEffect } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
  EvilIcons,
} from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { loadUser } from "../../redux/actions/userActions";
import useLogout from "../../hooks/useLogout";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user, userProfile, loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const logout = useLogout();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     dispatch(loadUser());
  //   }, [dispatch])
  // );

  const navigation = useNavigation();
  const signOut = () => {
    SecureStore.deleteItemAsync("secure_token")
      .then(() => {
        logout.onLogout();
        navigation.navigate("SignInScreen");
      })
      .catch((error) => {
        console.log("Check error", error);
      });
  };

  // console.log("Check profile", userProfile);

  return (
    <View>
      <View className="bg-blue-500 w-full h-[100px] justify-between flex flex-row items-center px-5">
        <View className="flex flex-row items-center gap-8">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={25} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl text-white">Profile</Text>
        </View>
      </View>
      <ScrollView>
        <View className="flex flex-col h-[200px] w-full absolute bg-blue-500 items-center">
          {userProfile?.avatar !== null ? (
            <Image
              className="w-[80px] h-[80px] rounded-full"
              source={{ uri: userProfile?.avatar }}
            />
          ) : (
            <Image
              className="w-[80px] h-[80px] rounded-full"
              source={require("../../assets/images/avatar.png")}
            />
          )}

          <Text className="text-[30px] font-bold text-white py-2">
            {userProfile?.fullName
              ? userProfile?.fullName
              : userProfile?.username}
          </Text>
          {/* <Text className="text-yellow-400">{userProfile?.role.name}</Text> */}
        </View>
        <View className="px-4 flex flex-col items-center">
          <View className="bg-white rounded-md w-[95%] relative mt-40 border border-gray-300 px-3 py-3">
            <Text className="text-center">
              Welcome to experience our app! Hopefully you will have interesting
              and rewarding moments.
            </Text>
            <View className="bg-gray-300 w-full h-[1px] my-5" />
            <View className="flex flex-col items-center">
              <Text className="py-3">Start looking for a vacation now!!</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Text className="text-blue-500 font-bold text-[20px]">
                  HolidaySwap!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="px-3 mt-4 mb-32">
          <Text className="text-3xl font-bold mb-3">Account</Text>
          <View className=" flex flex-col gap-1">
            {/* Edit account */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("ManageAccount")}
              className="flex flex-row items-center justify-between py-4 border-b border-slate-200"
            >
              <View className="flex flex-row items-center gap-2">
                <EvilIcons name="user" size={35} color="black" />
                <Text className="text-lg">Edit account</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("ChangePassword")}
              className="flex flex-row items-center justify-between py-4 border-b border-slate-200"
            >
              <View className="flex flex-row items-center gap-2">
                <AntDesign name="unlock" size={30} color="black" />
                <Text className="text-lg">Change password</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>

            {/* Wallet */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Wallet")}
              className="flex flex-row items-center justify-between py-4 pl-2 border-b border-slate-200"
            >
              <View className="flex flex-row items-center gap-2">
                <AntDesign name="wallet" size={20} color="black" />
                <Text className="text-lg">Wallet</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>

            {/* Booking history */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("YourTrip")}
              className="flex flex-row items-center justify-between py-4 pl-2 border-b border-slate-200"
            >
              <View className="flex flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="clipboard-list-outline"
                  size={20}
                  color="black"
                />
                <Text className="text-lg">Booking history</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>

            {/* Your apartment */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("YourApartment")}
              className="flex flex-row items-center justify-between py-4 pl-2 border-b border-slate-200"
            >
              <View className="flex flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="home-city-outline"
                  size={20}
                  color="black"
                />
                <Text className="text-lg">Your Apartment </Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>

            {/* Owner booking */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("OwnerBooking")}
              className="flex flex-row items-center justify-between py-4 pl-2"
            >
              <View className="flex flex-row items-center gap-2">
                <Octicons name="list-unordered" size={20} color="black" />
                <Text className="text-lg">Owner booking </Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Help */}
          {/* <Text className="text-3xl font-bold mb-3 mt-6">Help</Text>
          <View className=" flex flex-col gap-1">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("HelpCenter")}
              className="flex flex-row items-center justify-between py-4 pl-2"
            >
              <View className="flex flex-row items-center gap-2">
                <Ionicons name="help-circle-outline" size={20} />
                <Text className="text-lg">Contact customer service</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
          </View> */}

          {/* Discover */}
          <Text className="text-3xl font-bold mb-3 mt-6">Discover</Text>
          <View className=" flex flex-col gap-1">
            {/* posting */}
            {/* <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("PostBlog")}
              className="flex flex-row items-center justify-between py-4 pl-2 border-b border-slate-200"
            >
              <View className="flex flex-row items-center gap-2">
                <Octicons name="note" size={20} />
                <Text className="text-lg">Posting about travel</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity> */}

            {/* Community travel */}
            <TouchableOpacity
              onPress={() => navigation.navigate("BlogComunity")}
              className="flex flex-row items-center justify-between py-4 pl-2"
            >
              <View className="flex flex-row items-center gap-2">
                <Ionicons name="people-outline" size={20} />
                <Text className="text-lg">Blog travel</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* <Text className="text-3xl font-bold mb-3 mt-6">
            Setting and Juridical
          </Text>
          <View className=" flex flex-col gap-1">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex flex-row items-center justify-between py-4 pl-2"
            >
              <View className="flex flex-row items-center gap-2">
                <AntDesign name="setting" size={20} />
                <Text className="text-lg">Setting</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
          </View> */}
          {/* <Text className="text-3xl font-bold mb-3 mt-6">Partner</Text> */}
          <View className=" flex flex-col gap-1">
            {/* <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Landing")}
              className="flex flex-row items-center justify-between py-4 pl-2"
            >
              <View className="flex flex-row items-center gap-2">
                <MaterialCommunityIcons name="home-plus-outline" size={20} />
                <Text className="text-lg">Add apartment</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={signOut}
              className="flex flex-row items-center gap-3"
            >
              <AntDesign color="red" name="logout" size={25} />
              <Text className="text-red-600 underline text-lg font-bold">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
