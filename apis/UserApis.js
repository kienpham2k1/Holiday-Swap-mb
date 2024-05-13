import AxiosClient from "../config/AxiosConfig";

export const UserApis = {
    getCurrentProfile: () => AxiosClient.get('/users/profile')
};