import AxiosClient from "../config/AxiosConfig";

const MessageApis = {
    getMessagesByConversationId: (conversationId) => AxiosClient.get(`/message/${conversationId}/messages`),
    sendMessage: (conversationId, message) => AxiosClient.post(`/message/${conversationId}/send`, message, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }),
};

export default MessageApis;