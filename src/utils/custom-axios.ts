import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';

let callback401: (error: any) => void = () => {};

export function set401Callback(cb: any) {
  callback401 = cb;
}

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (!_.isEmpty(response) && response.status === 401 && !_.isNull(callback401)) {
      callback401(response.data.error);
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config: any) => {
    config.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('token') as string)}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export { axiosInstance as axios };
