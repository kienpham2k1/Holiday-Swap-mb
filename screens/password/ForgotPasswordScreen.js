import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, SafeAreaView } from "react-native";
import ButtonBack from "../../components/button/ButtonBack";
import { useNavigation } from "@react-navigation/native";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/actions/userActions";
import Toast from "react-native-toast-message";
import { FORGOT_PASSWORD_RESET } from "../../redux/constants/userConstants";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { message, success, error } = useSelector(
    (state) => state.forgotPassword
  );
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const handleForgotPassword = () => {
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (message) {
      navigation.navigate("VerifyOTP", { email: email });
      Toast.show({
        type: "success",
        text1: "Forgot password",
        text2: message,
      });
      dispatch({ type: FORGOT_PASSWORD_RESET });
    }

    if (error) {
      Toast.show({
        type: "error",
        text1: "Forgot password",
        text2: error,
      });
      dispatch({ type: FORGOT_PASSWORD_RESET });
    }
  }, [message, success, navigation, error, dispatch]);

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <SafeAreaView className="bg-white flex-1">
        <ScrollView className="flex-1">
          {/* Button Back */}
          <View className="pt-6">
            <ButtonBack navigation={navigation} />
          </View>

          {/* Title */}
          <View className="justify-center items-center flex w-full py-3">
            <Text className="text-3xl font-black justify-center mt-5">
              Forgot Password
            </Text>
            <Text className="text-lg font-normal">
              Recover your account password
            </Text>
          </View>

          {/* Input */}
          <Input
            label={"Email"}
            placeholder={"Enter your email"}
            type={"email-address"}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <Button
            text={"Continue"}
            style={{ marginTop: 40 }}
            onPress={handleForgotPassword}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ForgotPasswordScreen;
