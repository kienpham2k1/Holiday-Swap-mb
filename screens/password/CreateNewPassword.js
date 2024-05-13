import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, SafeAreaView } from "react-native";
import ButtonBack from "../../components/button/ButtonBack";
import { useNavigation, useRoute } from "@react-navigation/native";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/actions/userActions";
import Toast from "react-native-toast-message";
import { RESET_PASSWORD_OTP_RESET } from "../../redux/constants/userConstants";

const CreateNewPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, otp } = route.params;
  const { success, error } = useSelector((state) => state.forgotPassword);
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleResetPassword = () => {
    if (newPassword === confirmNewPassword) {
      dispatch(resetPassword(otp, email, newPassword));
    } else {
      Toast.show({
        type: "error",
        text1: "Reset password",
        text2: "New password not match with confirm new password",
      });
    }
  };

  useEffect(() => {
    if (success) {
      navigation.navigate("SignInScreen");
      Toast.show({
        type: "success",
        text1: "Reset password",
        text2: "Your password is reset. Login again!",
      });
      dispatch({ type: RESET_PASSWORD_OTP_RESET });
    }

    if (error) {
      Toast.show({
        type: "error",
        text1: "Reset password",
        text2: error,
      });
      dispatch({ type: RESET_PASSWORD_OTP_RESET });
    }
  }, [success, error, dispatch, navigation]);

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <SafeAreaView className="bg-white flex-1">
        <ScrollView className="flex-1">
          {/* Button Back */}
          <View className="pt-5">
            <ButtonBack navigation={navigation} />
          </View>

          {/* Title */}
          <View className="justify-center items-center flex w-full py-3">
            <Text className="text-3xl font-black justify-center mt-5">
              Create a new password
            </Text>
            <Text className="text-lg font-normal">Enter your new password</Text>
          </View>

          {/* Input */}
          <View>
            <Input
              editable={false}
              value={email}
              label={"Email"}
              placeholder={"Email"}
            />

            <Input
              label={"New Password"}
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
              placeholder={"Enter your new password"}
              secure={true}
            />

            <Input
              label={"Confirm Password"}
              value={confirmNewPassword}
              onChangeText={(text) => setConfirmNewPassword(text)}
              placeholder={"Enter your confirm password"}
              secure={true}
            />
          </View>

          <Button
            onPress={handleResetPassword}
            text={"Continue"}
            style={{ marginTop: 40 }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default CreateNewPassword;
