import {View, Text, StyleSheet, Image, Pressable, TouchableOpacity} from 'react-native';
import React from 'react';
import {AntDesign} from "@expo/vector-icons";
import {formatRelative} from "date-fns";
import {runOnJS} from "react-native-reanimated";

const NotificationWidget = ({notificationId, isRead, content, subject, createdOn, onPress}) => {
    return (
        <View style={style.row}>
            <AntDesign
                name="notification"
                size={32}
                color={`${isRead ? 'gray' : '#ff3030'}`}
            />
            <View className="w-full pl-3 pr-3 flex flex-col gap-1">
                <Text
                    className="text-[15px] font-bold text-ellipsis overflow-hidden text-gray-900 dark:text-white"
                >
                    {subject}
                </Text>
                <Text
                    className="text-ellipsis overflow-hidden text-sm text-gray-400 dark:text-zinc-400"
                >
                    {content}
                </Text>
                <View className="flex flex-row items-center pr-3">
                    <Text
                        className="text-xs text-blue-600 dark:text-blue-500"
                    >
                        {formatRelative(
                            new Date(createdOn),
                            new Date()
                        )}
                    </Text>
                    {!isRead && (
                        <View
                            style={{
                                backgroundColor: 'green',
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                marginLeft: 12,
                                marginRight: 3,
                                marginTop: 3,
                                marginBottom: 3,
                            }}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

export default NotificationWidget;

const style = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    }
});
