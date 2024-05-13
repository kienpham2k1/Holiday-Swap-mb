import AxiosClient from "../config/AxiosConfig";

const ConversationApis = {
    getCurrentUserConversation: () => AxiosClient.get('/conversation/current-user'),
    createConversation: (conversationName, userIds) => AxiosClient.post('/conversation/create', {
        conversationName,
        userIds,
    }),
    getContactWithOwner: (ownerId) => AxiosClient.get(`/conversation/current-user/contact/${ownerId}`),
    createCurrentUserConversation: (ownerId) => AxiosClient.post(`/conversation/current-user/contact/${ownerId}`),
};

export default ConversationApis;