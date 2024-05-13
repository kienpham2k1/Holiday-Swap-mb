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
import { loadUser, searchAllUser } from "../../redux/actions/userActions";
import Toast from "react-native-toast-message";
import { TRANFER_RESET } from "../../redux/constants/tranferConstants";
import { tranferPointAction } from "../../redux/actions/walletAction";
import ModalConfirmBase from "../../components/modal/ModalConfirmBase";

const Tranfer = () => {
  const data = [
    { label: "Property 1", value: "1" },
    { label: "Property 2", value: "2" },
    { label: "Property 3", value: "3" },
    { label: "Property 4", value: "4" },
    { label: "Property 5", value: "5" },
    { label: "Property 6", value: "6" },
    { label: "Property 7", value: "7" },
    { label: "Property 8", value: "8" },
  ];
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const { userProfile } = useSelector((state) => state.user);
  const { usersSearch } = useSelector((state) => state.searchAllUsers);
  const { success, tranferPoint, error } = useSelector(
    (state) => state.tranferPoint
  );
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(searchAllUser());
    }, [dispatch])
  );

  useEffect(() => {
    if (success) {
      Toast.show({
        type: "success",
        text1: "Tranfer",
        text2: "Tranfer successfully!",
      });
      navigation.navigate("Wallet");
      dispatch({ type: TRANFER_RESET });
    }

    if (error) {
      Toast.show({
        type: "error",
        text1: "Tranfer",
        text2: error,
      });
      dispatch({ type: TRANFER_RESET });
    }
  }, [success, error]);

  const [value, setValue] = useState();
  const [amount, setAmount] = useState(0);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.username}</Text>
      </View>
    );
  };

  const handleTranferPoint = () => {
    if (userProfile && value && amount) {
      dispatch(tranferPointAction(userProfile.userId, value, amount));
      setModalVisible(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Tranfer",
        text2: "You have left a field blank",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-blue-500 w-full h-[100px]  flex flex-row items-center justify-start px-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={30} color="white" />
        </TouchableOpacity>
        <Text className="ml-8 text-[20px] text-white">Tranfer point</Text>
      </View>
      <ScrollView className="px-4">
        <View className="flex flex-col pt-5">
          <Text className="text-lg font-bold">Source account</Text>
          <TextInput
            editable={false}
            value={
              userProfile?.fullName
                ? userProfile?.fullName
                : userProfile?.username
            }
            className="w-[100%] p-2 rounded-md border border-slate-400 text-black"
            placeholder="source account"
          />
        </View>

        <View className="flex flex-col pt-5">
          <Text className="text-lg font-bold">Account to receive</Text>
          {usersSearch && (
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={usersSearch}
              search
              maxHeight={210}
              labelField="username"
              valueField="userId"
              placeholder="Select item"
              searchPlaceholder="Search..."
              value={value}
              onChange={(item) => {
                setValue(item.userId);
              }}
              renderItem={renderItem}
            />
          )}
        </View>

        <View className="flex flex-col pt-5">
          <Text className="text-lg font-bold">Number of point tranfer</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={(text) => setAmount(text)}
            className="w-[100%] p-2 rounded-md border border-slate-400"
            placeholder="Amount"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}
          className="bg-blue-500 px-6 rounded-md py-3 mt-7"
        >
          <Text className="text-white text-center text-lg">Tranfer</Text>
        </TouchableOpacity>

        <ModalConfirmBase
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onPress={handleTranferPoint}
          context={"Are you sure want to tranfer?"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tranfer;

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
