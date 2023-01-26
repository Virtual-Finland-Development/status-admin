import axios from 'axios';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { isPast, fromUnixTime } from 'date-fns';

import { STATUS_INFO_API_BASE_URL } from './endpoints';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  config => {
    const idToken = localStorage.getItem('auth');

    if (config.url && config.headers) {
      if (config.url.includes(`${STATUS_INFO_API_BASE_URL}/status-admin/`)) {
        config.headers.Authorization = idToken ? `Bearer ${idToken}` : '';
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const idToken = localStorage.getItem('auth');
    const decodedToken: JwtPayload | null = idToken
      ? jwt_decode(idToken)
      : null;

    if (decodedToken?.exp && isPast(fromUnixTime(decodedToken.exp))) {
      alert('Your session has expired, please authenticate to continue.');
      window.postMessage('auth-expired');
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
