import React, {useState} from "react";
import {Text, TouchableOpacity} from "react-native";
import {View} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import InputEmail from "../../components/input/InputEmail";
import InputPassword from "../../components/input/InputPassword";
import BtnLoginGoogle from "../../components/button/BtnLoginGoogle";
import {useNavigation} from "@react-navigation/native";
import SearchBar from "../../components/search/SearchBar";
import {Image} from "react-native";
import {ScrollView} from "react-native";
import TabViewMessageAndNotification from "../../components/notification/TabViewMessageAndNotification";
import {Ionicons} from "@expo/vector-icons";

export default function ChatScreen() {
    const [isGreen, setIsGreen] = useState(false);
    const navigation = useNavigation();

    const toggleColor = () => {
        setIsGreen(!isGreen);
    };

    return (
        <>
            <View className="bg-blue-500 w-full h-[100px]  flex flex-row items-center justify-start px-5">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={25} color="white"/>
                </TouchableOpacity>
                <Text className="ml-8 text-[20px] text-white">Messages</Text>
            </View>
            <TabViewMessageAndNotification/>
        </>
    );
}
