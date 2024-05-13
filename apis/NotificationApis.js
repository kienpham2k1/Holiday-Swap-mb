import AxiosClient from "../config/AxiosConfig";

export const NotificationApis = {
    getAll: () => AxiosClient.get('/notifications/current-user'),
    readAll: () => AxiosClient.put('/notifications/current-user/read-all'),
    deleteAll: () => AxiosClient.delete('/notifications/current-user'),
    deleteById: (id) => AxiosClient.delete(`/notifications/current-user/${id}`),
    readById: (id) => AxiosClient.put(`/notifications/current-user/read/${id}`),
};