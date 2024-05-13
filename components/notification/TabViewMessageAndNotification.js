import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CarouselApartmentHome from "../apartment/CaroselApartmentHome";
import SearchBar from "../search/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { NotificationApis } from "../../apis/NotificationApis";
import {
  fetchNotifications,
  readNotificationById,
} from "../../redux/slices/pushNotificationSlice";
import { formatRelative } from "date-fns";
import {
  fetchConversations,
  setConversationLoaded,
} from "../../redux/slices/conversationSlice";
import ConversationApis from "../../apis/ConversationApis";
import { UserApis } from "../../apis/UserApis";
import Swipable from "./swipable";
import NotificationWidget from "./notificationWidget";
import Loading from "../Loading";

const getAvatarSource = (item, currentUser) => {
  const defaultAvatar = `https://ui-avatars.com/api/?name=${item.conversationName}`;
  if (item?.participants?.length > 2) {
    return defaultAvatar;
  }
  const participant = item?.participants.find(
    (user) => user.user.userId !== currentUser?.userId
  )?.user;
  return (
    participant?.avatar ||
    `https://ui-avatars.com/api/?name=${
      participant?.username || item.conversationName
    }`
  );
};

export default function TabViewMessageAndNotification() {
  const tabs = ["Chats", "Notifications"];
  const [selectedTab, setSelectedTab] = useState("Chats");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const notifications = useSelector((state) => state.pushNotification.data);
  const conversations = useSelector((state) => state.conversation.data);
  const conversationLoaded = useSelector((state) => state.conversation.loaded);
  const [currentUser, setCurrentUser] = useState();
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const [conversationList, setConversationList] = useState();

  const fetchConversationData = useCallback(() => {
    ConversationApis.getCurrentUserConversation().then((res) => {
      const result = searchText
        ? filterConversationsByKeyword(res, searchText)
        : res;
      setConversationList(result);
    });
  }, [searchText]);

  const handleSearchConversation = () => {
    dispatch(setConversationLoaded(false));
    fetchConversationData();
    if (searchText) {
      const result = filterConversationsByKeyword(conversationList, searchText);
      setConversationList(result);
    } else {
      fetchConversationData();
    }
    dispatch(setConversationLoaded(true));
  };

  const filterConversationsByKeyword = (conversations, keyword) => {
    return conversations?.filter(
      (item) =>
        item?.conversationName
          ?.toString()
          ?.toLowerCase()
          ?.trim()
          ?.includes(keyword?.toLowerCase()?.trim()) ||
        item?.participants?.find((participant) =>
          participant?.user?.username
            ?.toString()
            ?.toLowerCase()
            ?.includes(keyword?.toLowerCase()?.trim())
        )
    );
  };

  useEffect(() => {
    const result = searchText
      ? filterConversationsByKeyword(conversations, searchText)
      : conversations;
    setConversationList(result);
  }, [conversations]);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      NotificationApis.getAll().then((res) => {
        dispatch(fetchNotifications(res));
      });
      dispatch(setConversationLoaded(false));
      ConversationApis.getCurrentUserConversation().then((res) => {
        dispatch(fetchConversations(res));
        dispatch(setConversationLoaded(true));
      });
      UserApis.getCurrentProfile().then((res) => {
        setCurrentUser(res);
      });
      setLoading(false);
    }, [dispatch])
  );

  useEffect(() => {
    fetchConversationData();
  }, [fetchConversationData]);

  const [selectedIndex, setSelectedIndex] = useState(undefined);

  const handleDelete = (deletedNotificationId, isApplicable) => {
    setTimeout(() => {
      const filteredList = notifications.filter(
        (item) =>
          item?.notificationId?.toString() !== deletedNotificationId?.toString()
      );
      deletedNotificationId &&
        NotificationApis.deleteById(deletedNotificationId).catch((error) => {
          console.log(error);
        });
      dispatch(fetchNotifications(filteredList));
    }, 600);
  };

  const handleRead = (notificationId) => {
    dispatch(readNotificationById(notificationId));
    NotificationApis.readById(notificationId).catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    handleSearchConversation();
  }, [searchText]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Chats":
        return (
          <View className="flex-1">
            <SearchBar onChangeText={setSearchText} searchText={searchText} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="w-[95%] pt-3 pb-5"
            >
              {conversationList && conversationLoaded ? (
                conversationList?.length !== 0 ? (
                  conversationList?.map((item, index) => (
                    <TouchableOpacity
                      key={item?.conversationId}
                      className="flex bg-red flex-row items-center w-full py-4 gap-2 px-3"
                      onPress={() =>
                        navigation.navigate("ChatItemScreen", {
                          avatar: getAvatarSource(item, currentUser),
                          conversationId: item?.conversationId,
                          conversationName:
                            item.participants?.length > 2
                              ? item.conversationName
                              : item.participants?.find(
                                  (user) =>
                                    user.user.userId !== currentUser?.userId
                                )?.user?.username,
                          currentUser: currentUser,
                          users: item?.participants,
                        })
                      }
                    >
                      <Image
                        className="mr-[4px] rounded-full w-[60] h-[60]"
                        source={{ uri: getAvatarSource(item, currentUser) }}
                      />
                      <View className="w-full pr-2 flex flex-col">
                        <Text className="text-[15px] font-bold text-ellipsis overflow-hidden text-gray-900 dark:text-white">
                          {item.participants?.length > 2
                            ? item.conversationName
                            : item.participants?.find(
                                (user) =>
                                  user.user.userId !== currentUser?.userId
                              )?.user?.username}
                        </Text>
                        <Text className="text-ellipsis overflow-hidden text-sm text-gray-400 dark:text-zinc-400">
                          {item?.message?.authorId &&
                          item?.participants?.length > 0
                            ? item?.message?.authorId === currentUser?.userId
                              ? "You: "
                              : (item?.participants?.find(
                                  (user) =>
                                    user?.user?.userId ===
                                    item?.message?.authorId
                                )?.user?.username ?? "") + ": "
                            : ""}
                          {item?.message?.text ?? "Started a Conversation"}{" "}
                        </Text>
                        {item?.message?.createdOn && (
                          <Text className="text-xs text-blue-600 dark:text-blue-500">
                            {formatRelative(
                              new Date(item?.message?.createdOn),
                              new Date()
                            )}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="px-4">
                    <Text className="text-[20px] py-3 font-bold">
                      No conversation yet... Still none.
                    </Text>
                    <Text className="w-[80%] text-[15px] py-3">
                      "It's time to start a new conversation and connect with
                      someone."
                    </Text>
                  </View>
                )
              ) : (
                <View className="mt-56">
                  <Loading />
                </View>
              )}
            </ScrollView>
          </View>
        );
      case "Notifications":
        return (
          <View style={styles.shadow} className="flex-1 ">
            <View style={styles.container}>
              {notifications &&
                (notifications?.length !== 0 ? (
                  <FlatList
                    data={notifications}
                    extraData={notifications.length}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <Swipable
                        key={item?.notificationId}
                        index={index}
                        isRead={item?.isRead}
                        {...item}
                        handleRead={handleRead}
                        notificationId={item?.notificationId}
                        backgroundColor={item.isRead ? "#f51b53" : "#ff3030"}
                        handleDelete={handleDelete}
                        setSelectedIndex={setSelectedIndex}
                        selectedIndex={selectedIndex}
                        totalConversation={notifications.length}
                      >
                        <NotificationWidget {...item} onPress={handleRead} />
                      </Swipable>
                    )}
                  />
                ) : (
                  <View className="px-4">
                    <Text className="text-[18px] py-2 font-bold text-center mt-4">
                      No notification.
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 px-4 bg-white">
      <View>
        <View className="flex flex-row gap-6">
          {tabs?.map((tab) => (
            <TouchableOpacity
              className="pb-1"
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[
                styles.tabButton,
                {
                  borderBottomWidth: selectedTab === tab ? 2 : 0,
                  borderBottomColor:
                    selectedTab === tab ? "#009FC2" : "transparent",
                },
              ]}
            >
              <Text
                className="text-[15px] font-bold mt-3"
                style={selectedTab === tab ? { color: "#007FC4" } : {}}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {loading ? <Loading /> : renderTabContent()}
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
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});
