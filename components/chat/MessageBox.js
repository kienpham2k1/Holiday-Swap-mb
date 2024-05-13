import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { formatRelative } from "date-fns";

const MessageBox = ({ message, users, currentUser }) => {
  const user = users?.find(
    (item) => item?.user?.userId?.toString() === message?.authorId?.toString()
  );
  const isOwn =
    message?.authorId?.toString() === currentUser?.userId?.toString();
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const getAvatarSource = (name) => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${name}`;

    return defaultAvatar;
  };

  return (
    <View>
      {isOwn ? (
        <View className="flex flex-row mb-3 justify-end">
          <View className="-mr-[8%]">
            {message.image && (
              <TouchableOpacity onPress={openModal}>
                <View className="flex flex-row justify-end">
                  <Image
                    style={{ width: 200, aspectRatio: 1 }}
                    source={{ uri: message?.image }}
                    accessibilityViewIsModal={true}
                  />
                </View>
              </TouchableOpacity>
            )}
            <View className="flex flex-row justify-end w-[85%]">
              {message.text && (
                <Text className="bg-blue-500 w-fit justify-end text-white py-2 rounded-xl px-3">
                  {message.text}
                </Text>
              )}
            </View>
            <View className="flex flex-row justify-end mr-[15%]">
              <Text className="text-gray-400 text-[12px] ">
                {formatRelative(new Date(message.createdOn), new Date())}
              </Text>
            </View>
          </View>
          <Image
            width={30}
            height={30}
            className="w-[40px] h-[40px] rounded-full"
            source={
              user?.user?.avatar
                ? { uri: user.user.avatar }
                : require("../../assets/images/avatar.png")
            }
          />
        </View>
      ) : (
        <View className="flex flex-row mb-3">
          <Image
            width={30}
            height={30}
            className="w-[40px] h-[40px] rounded-full"
            source={
              user?.user?.avatar
                ? { uri: user.user.avatar }
                : { uri: getAvatarSource(user.user.username) }
            }
          />

          <View className="ml-[5%]">
            {message.image && (
              <TouchableOpacity onPress={openModal}>
                <View className="flex flex-row justify-start">
                  <Image
                    style={{ width: 200, aspectRatio: 1 }}
                    source={{ uri: message?.image }}
                    accessibilityViewIsModal={true}
                  />
                </View>
              </TouchableOpacity>
            )}
            <View className="flex flex-row justify-start w-[90%]">
              {message.text && (
                <Text className="bg-gray-200 w-fit text-gray-600 py-2 px-3 rounded-xl">
                  {message.text}
                </Text>
              )}
            </View>
            <Text className="text-gray-400 text-[12px]">
              {formatRelative(new Date(message.createdOn), new Date())}
            </Text>
          </View>
        </View>
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={{ uri: message?.image }}
            style={{ aspectRatio: 1 }}
            className="w-full"
          />
          <TouchableOpacity onPress={closeModal}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default MessageBox;
