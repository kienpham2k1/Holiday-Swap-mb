import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  loadUser,
  resetPassword,
  searchAllUser,
} from "../../redux/actions/userActions";
import Toast from "react-native-toast-message";
import { TRANFER_RESET } from "../../redux/constants/tranferConstants";
import { tranferPointAction } from "../../redux/actions/walletAction";
import ModalConfirmBase from "../../components/modal/ModalConfirmBase";
import * as SecureStore from "expo-secure-store";
import { RESET_PASSWORD_RESET } from "../../redux/constants/userConstants";

const ChangePassword = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const { userProfile } = useSelector((state) => state.user);
  const { success, error } = useSelector((state) => state.forgotPassword);

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const handleResetPassword = () => {
    dispatch(resetPassword(oldPassword, password, confirmPassword));
    setModalVisible(false);
  };

  useEffect(() => {
    const token = async () => {
      if (success) {
        await SecureStore.deleteItemAsync("secure_token").then(() => {
          navigation.navigate("SignInScreen");
        });
        dispatch({ type: RESET_PASSWORD_RESET });
      }

      if (error) {
        Toast.show({
          type: "error",
          text1: "Change password",
          text2: error,
        });
        dispatch({ type: RESET_PASSWORD_RESET });
      }
    };
    token();
  }, [success, navigation, error, dispatch]);

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-blue-500 w-full h-[100px]  flex flex-row items-center justify-start px-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={30} color="white" />
        </TouchableOpacity>
        <Text className="ml-8 text-[20px] text-white">Change password</Text>
      </View>
      <ScrollView className="px-4">
        <View className="flex flex-col pt-5">
          <Text className="text-lg font-bold">Old Password</Text>
          <TextInput
            secureTextEntry={true}
            value={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
            className="w-[100%] p-2 rounded-md border border-slate-400 text-black"
            placeholder="Old password"
          />
        </View>

        <View className="flex flex-col pt-5">
          <Text className="text-lg font-bold">New Password</Text>
          <TextInput
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
            className="w-[100%] p-2 rounded-md border border-slate-400"
            placeholder="New password"
          />
        </View>

        <View className="flex flex-col pt-5">
          <Text className="text-lg font-bold">Confirm New Password</Text>
          <TextInput
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            className="w-[100%] p-2 rounded-md border border-slate-400"
            placeholder="Confirm New password"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}
          className="bg-blue-500 px-6 rounded-md py-3 mt-7"
        >
          <Text className="text-white text-center text-lg">
            Change password
          </Text>
        </TouchableOpacity>

        <ModalConfirmBase
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onPress={handleResetPassword}
          context={"Are you sure want to change password?"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
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
