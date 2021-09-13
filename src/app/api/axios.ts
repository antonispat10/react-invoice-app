import AxiosStatic, { AxiosInstance } from 'axios';

const axiosConfig = {
    baseURL: 'https://jean-test-api.herokuapp.com/',
    headers: {
        common: { ['X-SESSION']: '19a9145c-53bd-4388-b17c-0ccac589b6f9' }
    }
};

const axios = AxiosStatic.create(axiosConfig);
export type { AxiosInstance };
export default axios;
