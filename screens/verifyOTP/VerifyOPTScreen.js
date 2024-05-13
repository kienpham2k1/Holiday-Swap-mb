import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Keyboard,
  Pressable,
} from "react-native";
import * as Icon from "react-native-feather";
import OTPInputField from "../../components/input/OTPInputField";
import Button from "../../components/button/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import ModalConfirm from "../../components/modal/ModalConfirm";
import ButtonBack from "../../components/button/ButtonBack";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../redux/actions/userActions";
import Toast from "react-native-toast-message";

const VerifyOPTScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { success, error } = useSelector((state) => state.verifyOtp);
  const dispatch = useDispatch();
  const [pinReady, setPinReady] = useState(false);
  const MAX_CODE_LENGTH = 6;

  const handleVerifyOTP = () => {
    if (code && email) {
      dispatch(verifyOtp(code, email));
    } else {
      Toast.show({
        type: "error",
        text1: "Verify OTP",
        text2: "Please input OTP and email to verify",
      });
    }
  };

  useEffect(() => {
    if (success) {
      navigation.navigate("CreateNewPassword", { email: email, otp: code });
      Toast.show({
        type: "success",
        text1: "Verify OTP",
        text2: "Verify success, you can reset your password!",
      });
    }

    if (error) {
      Toast.show({
        type: "error",
        text1: "Verify OTP",
        text2: error,
      });
    }
  }, [success, error]);

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView>
          {/* Button back */}
          <View className="pt-5">
            <ButtonBack navigation={navigation} />
          </View>

          {/* Title */}
          <View className="justify-center items-center flex w-full py-3">
            <Text className="text-3xl font-bold justify-center">
              Verify OTP
            </Text>
            <Text className="text-lg font-normal mx-6 my-6 text-center">
              We have just sent 6 digit code via your email: {email}
            </Text>
          </View>

          <OTPInputField
            setPinReady={setPinReady}
            code={code}
            setCode={setCode}
            maxLength={MAX_CODE_LENGTH}
          />
          <Button
            text={"Continue"}
            disabled={!pinReady}
            style={{
              backgroundColor: !pinReady ? "#66B4F4" : "#2196F3",
              marginTop: 60,
            }}
            onPress={handleVerifyOTP}
          />

          <View>
            <View className="flex-row justify-center">
              <Text className="text-lg font-bold">Didn’t receive code? </Text>
              <Text className="text-lg font-bold text-[#2196F3]">
                Resend code
              </Text>
            </View>
          </View>

          {/* Modal */}
          <ModalConfirm
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default VerifyOPTScreen;
