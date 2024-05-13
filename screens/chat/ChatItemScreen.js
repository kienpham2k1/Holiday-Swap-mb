import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import { TextInput } from "react-native-paper";
import MessageBox from "../../components/chat/MessageBox";
import MessageApis from "../../apis/MessageApis";
import * as SecureStore from "expo-secure-store";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useSelector } from "react-redux";

export default function ChatItemScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { conversationId, conversationName, currentUser, users, avatar } =
    route.params;
  const [messages, setMessages] = useState();
  const [textMessage, setTextMessage] = useState();
  const [client, setClient] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, userProfile } = useSelector((state) => state.user);
  const [sending, setSending] = useState(false);

  const scrollViewRef = useRef();

  const getToken = async () => {
    return await SecureStore.getItemAsync("secure_token");
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useFocusEffect(
    React.useCallback(() => {
      MessageApis.getMessagesByConversationId(conversationId).then((res) =>
        setMessages(res)
      );
    }, [conversationId])
  );

  useEffect(() => {
    const tokenPromise = getToken().then((res) => {
      setLoading(true);
      console.log(res);
      console.log("SOCKCET CREATING...");
      if (res) {
        const updatedClient = new Client({
          brokerURL: "https:///api.holiday-swap.click/websocket",
          connectHeaders: {
            ["Authorization"]: `${res}`,
          },
          reconnectDelay: 2000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          logRawCommunication: true,
          webSocketFactory: () => {
            return SockJS("https:///api.holiday-swap.click/websocket");
          },
        });
        updatedClient.onConnect = () => {
          updatedClient.subscribe(
            `/topic/${conversationId}`,
            (message) => {
              const newMessage = JSON.parse(message.body);
              setMessages((current) => {
                return [newMessage, ...current];
              });
              scrollViewRef?.current?.scrollToEnd({ animated: true });
            },
            {
              ["Authorization"]: `${res}`,
            }
          );
        };
        updatedClient.activate();
        setLoading(false);
        setClient(updatedClient);
      }
    });
    return () => {
      if (client) {
        client.deactivate();
        setClient(null);
        // console.log("Socket closed");
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (textMessage && textMessage?.trim().length > 0) {
      setSending(true);
      const formData = new FormData();
      formData.append("text", textMessage);
      formData.append("authorId", String(currentUser?.userId));
      setTextMessage("");
      MessageApis.sendMessage(conversationId, formData).catch((error) => {
        console.error("Error sending message:", error);
      });
    }
    setSending(false);
  };

  const handleTextChange = (text) => {
    setTextMessage(text);
  };

  return (
    <View className="flex flex-1">
      <View className="align-middle bg-white w-full h-fit flex flex-row items-center justify-between px-1 pt-10 pb-5">
        <View className="flex flex-row items-center">
          <TouchableOpacity
            className="flex flex-row w-[40px] h-[40px] items-center justify-center align-middle"
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={25} />
          </TouchableOpacity>
          <Image
            className="w-[40px] h-[40px] rounded-full"
            source={{ uri: avatar }}
          />
          <Text className="ml-1 text-[20px]">{conversationName}</Text>
        </View>
      </View>
      <ScrollView ref={scrollViewRef}>
        <View className="px-4 py-4 w-full">
          {messages &&
            messages
              ?.slice() // Create a shallow copy to avoid mutating the original array
              ?.reverse()
              ?.map((message, index) => (
                <MessageBox
                  key={index}
                  message={message}
                  currentUser={currentUser}
                  users={users}
                ></MessageBox>
              ))}
        </View>
      </ScrollView>
      <View className="px-4 py-3">
        <View className="bg-blue-100 border border-gray-300 rounded-3xl  px-2">
          <View className="flex flex-row justify-between items-center w-[70%]">
            <View className="flex flex-row items-center ">
              <TouchableOpacity className="border-r border-gray-400 pr-3">
                <MaterialCommunityIcons size={30} name="attachment" />
              </TouchableOpacity>
              <TextInput
                className="w-[100%] bg-transparent"
                value={textMessage ?? ""}
                placeholder="Write a message"
                onChangeText={handleTextChange}
              />
            </View>
            <View>
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={sending}
                className={`${
                  sending ? "bg-blue-300" : "bg-blue-500"
                } rounded-full px-2 py-2 flex flex-row items-center justify-center`}
              >
                <Feather name="send" size={25} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
