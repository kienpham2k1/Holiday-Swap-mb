import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, updateProfile } from "../../redux/actions/userActions";
import { Text } from "react-native";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import UploadImage from "../../components/addApartment/UploadImage";
import UploadImageProfile from "./UploadImageProfile";
import { launchImageLibrary } from "react-native-image-picker";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { format, setHours } from "date-fns";
import {
  UPDATE_PASSWORD_RESET,
  UPDATE_PROFILE_RESET,
} from "../../redux/constants/userConstants";
import Toast from "react-native-toast-message";
import { Dropdown } from "react-native-element-dropdown";

export default function ManageAccount() {
  const { user, userProfile, loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const data = [
    { label: "MALE", value: "MALE" },
    { label: "FEMALE", value: "FEMALE" },
    { label: "OTHER", value: "OTHER" },
  ];

  const {
    success,
    isUpdated,
    error: errorProfile,
  } = useSelector((state) => state.profile);

  const [date, setDate] = useState(new Date(...userProfile.dob));
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");

  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(userProfile?.avatar ?? null);
  const [avatarSubmit, setAvatarSubmit] = useState();
  const [fullName, setFullName] = useState(
    userProfile?.fullName ?? "Trong Tin"
  );
  const [dob, setDob] = useState(userProfile?.dob);
  const [gender, setGender] = useState(userProfile?.gender);

  const handleSaveProfile = () => {
    const userData = {
      avatar: avatarSubmit ?? userProfile?.avatar,
      fullName: fullName,
      gender: gender,
      dob: new Date(date).setHours(0, 0, 0, 0),
    };

    dispatch(updateProfile(userData));
  };

  useEffect(() => {
    if (success === true) {
      navigation.navigate("root");
      Toast.show({
        type: "success",
        text1: "Edit Profile",
        text2: "Edit profile success",
      });
      dispatch({ type: UPDATE_PROFILE_RESET });
    }

    if (errorProfile) {
      Toast.show({
        type: "error",
        text1: "Edit profile",
        text2: errorProfile,
      });
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [success, navigation, dispatch, errorProfile]);

  const navigation = useNavigation();

  const handleChangeImage = (value) => {
    setAvatar(Object.assign({}, value));
    setAvatarSubmit(Object.assign({}, value));
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const renderItem = (item) => {
    return (
      <View style={stylesDropdown.item}>
        <Text style={stylesDropdown.textItem}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <View className="bg-blue-500 w-full h-[100px]  flex flex-row items-center justify-start px-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text className="ml-8 text-[20px] text-white">Your details</Text>
      </View>
      <ScrollView>
        <View style={styles.shadow} className="mx-2 my-2 px-4 py-4 bg-white ">
          <Text className="text-[15px] mt-5 font-bold">Public Details</Text>
          <View className="flex flex-row items-center py-5 gap-5">
            <Image
              className="w-16 h-16 rounded-full"
              source={
                userProfile.avatar || avatar["0"]["uri"]
                  ? { uri: avatar["0"]["uri"] || userProfile?.avatar }
                  : require("../../assets/images/avatar.png")
              }
            />

            <TextInput
              className=" bg-transparent px-1 w-[72%] border-b border-gray-500"
              value={fullName}
              editable={false}
            />
          </View>
          <UploadImageProfile handleChangeImage={handleChangeImage} />
        </View>
        <View style={styles.shadow} className="mx-2 my-2 px-4 py-4 bg-white ">
          <Text className="text-[15px] font-bold">Personal infomation</Text>
          <View className="my-5">
            <TextInput
              // onChangeText={handleInputChange}
              label={"Full Name"}
              className="w-[100%] bg-transparent border-b border-gray-400"
              value={fullName}
              onChangeText={(text) => setFullName(text)}
            />
          </View>
          <View className="my-5">
            <TextInput
              label={"Date of birth"}
              // onChangeText={handleInputChange}
              keyboardType="numbers-and-punctuation"
              className=" bg-transparent w-[100%] border-b border-gray-400"
              value={format(date, "dd-MM-yyyy")}
              onPressIn={showDatepicker}
            />
          </View>

          {/* <View className="my-5">
            <TextInput
              // onChangeText={handleInputChange}
              label="Phone number"
              editable={false}
              value={userProfile?.phone}
              className="  w-[100%] border-b border-gray-400 bg-transparent"
            />
          </View> */}
          <View className="my-5">
            <Dropdown
              style={stylesDropdown.dropdown}
              placeholderStyle={stylesDropdown.placeholderStyle}
              selectedTextStyle={stylesDropdown.selectedTextStyle}
              inputSearchStyle={stylesDropdown.inputSearchStyle}
              iconStyle={stylesDropdown.iconStyle}
              data={data}
              search
              maxHeight={270}
              labelField="label"
              valueField="value"
              placeholder="Select gender"
              searchPlaceholder="Search..."
              value={gender}
              onChange={(item) => {
                setGender(item.value);
              }}
              renderItem={renderItem}
            />
          </View>
        </View>
        <View style={styles.shadow} className="mx-2 my-2 px-4 py-4 bg-white ">
          <Text>Email adress</Text>
          <View className="flex flex-row items-center gap-4 py-4">
            <AntDesign name="checkcircleo" size={25} color="green" />
            <View>
              <Text>{userProfile?.email}</Text>
              <Text>{userProfile?.phone}</Text>
              <Text>Email and phone has been confirmed</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text className="text-blue-500">EDIT EMAIL ADDRESS</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSaveProfile}>
          <Text className="text-[20px] bg-blue-500 p-3 text-center text-white mx-2 mb-2 font-bold">
            Save
          </Text>
        </TouchableOpacity>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </ScrollView>
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

const stylesDropdown = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
