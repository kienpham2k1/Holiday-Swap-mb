import React from 'react'

import EventEmitter from 'eventemitter3'
import PropTypes from 'prop-types'

import SockJS from 'sockjs-client'
import {Client} from '@stomp/stompjs'
import {registerForPushNotificationsAsync, schedulePushNotification} from "./notification";
import {UserApis} from "../apis/UserApis";
import {addNotification} from "../redux/slices/pushNotificationSlice";
import ConversationApis from "../apis/ConversationApis";
import {fetchConversations} from "../redux/slices/conversationSlice";


if (typeof TextEncoder !== 'function') {
    const TextEncodingPolyfill = require('text-encoding')
    TextEncoder = TextEncodingPolyfill.TextEncoder
}


// Stomp client
let _stompClient = null

const logger = console // Use any logger you want here
const stompEvent = new EventEmitter()

// WebSocketError is more reliable on detecting the connection lost
const StompEventTypes = {
    Connect: 0,
    Disconnect: 1,
    Error: 2,
    WebSocketClose: 3,
    WebSocketError: 4,
}


const newStompClient = async (url, token, dispatch) => {
    if (_stompClient) {
        _stompClient.deactivate()
        _stompClient = null
    }
    const currentProfile = await UserApis.getCurrentProfile()
    const userId = currentProfile?.userId
    let conversationIds = [];
    let conversations = [];
    ConversationApis.getCurrentUserConversation().then((res) => {
        dispatch(fetchConversations(res));
        conversations = res;
        conversationIds =
            res?.map((item) => item.conversationId.toString()) || [];
    });
    logger.log('Stomp trying to connect', url, token)

    // let socket = SockJS(url)
    _stompClient = new Client({
        brokerURL: `${url}`,
        connectHeaders: {
            ['Authorization']: `${token}`,
        },
        // debug: (str) => {
        //     logger.log(str)
        // },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        logRawCommunication: true,
        webSocketFactory: () => {
            return SockJS(url)
        },
        onStompError: (frame) => {
            logger.log('Stomp Error', frame)
            stompEvent.emit(StompEventTypes.Error, frame)
        },
        onConnect: (frame) => {
            logger.log('Stomp Connect', frame)
            _stompClient.subscribe(`/topic/notification-${userId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                // logger.log(`Received: ${newMessage}`);
                dispatch(addNotification(newMessage));
                registerForPushNotificationsAsync()
                    .then(() => schedulePushNotification(newMessage?.subject
                        , newMessage?.content));
            }, {
                ['Authorization']: `${token}`,
            });
            conversationIds?.forEach((conversationId) => {
                _stompClient.subscribe(`/topic/${conversationId}`, (message) => {
                    // console.log('RECEIVED MESSAGE FROM CONVERSATION', conversationId);
                    const newMessage = JSON.parse(message?.body);
                    const updatedConversations = conversations?.map((conversation) => {
                        if (conversation?.conversationId?.toString() === conversationId) {
                            return {
                                ...conversation,
                                message: newMessage,
                            };
                        }
                        return conversation;
                    });
                    dispatch(fetchConversations(updatedConversations));
                }, {
                    ['Authorization']: `${token}`,
                });
            });
            stompEvent.emit(StompEventTypes.Connect, frame)
        },
        onDisconnect: (frame) => {
            logger.log('Stomp Disconnect', frame)
            stompEvent.emit(StompEventTypes.Disconnect, frame)
        },
        onWebSocketClose: (frame) => {
            logger.log('Stomp WebSocket Closed', frame)
            stompEvent.emit(StompEventTypes.WebSocketClose, frame)
        },
        onWebSocketError: (frame) => {
            logger.log('Stomp WebSocket Error', frame)
            stompEvent.emit(StompEventTypes.WebSocketError, frame)
        },
    })

    _stompClient.activate()

    return _stompClient
}

const removeStompClient = () => {
    if (_stompClient) {
        logger.log('Stomp trying to disconnect')
        _stompClient.deactivate()

        _stompClient = null
    }
}

const addStompEventListener = (eventType, emitted, context, isOnce) => {
    if (isOnce) {
        stompEvent.once(eventType, emitted, context)
    } else {
        stompEvent.on(eventType, emitted, context)
    }
}

const removeStompEventListener = (eventType, emitted, context) => {
    stompEvent.removeListener(eventType, emitted, context)
}

const getStompClient = () => {
    return _stompClient
}

// React Context and our functions
export const stompContext = {
    getStompClient,
    newStompClient,
    removeStompClient,
    addStompEventListener,
    removeStompEventListener
}

const withSocket = (Component) => (
    (props) => {
        const wrapped = <Component stompContext={stompContext} {...props} />

        wrapped.propTypes = {
            stompContext: PropTypes.shape({
                getStompClient: PropTypes.func,
                newStompClient: PropTypes.func,
                removeStompClient: PropTypes.func,
                addStompEventListener: PropTypes.func,
                removeStompEventListener: PropTypes.func,
            })
        }

        return wrapped
    }
)

withSocket.propTypes = {
    Component: PropTypes.element,
}


// Exports
export {StompEventTypes, withSocket}