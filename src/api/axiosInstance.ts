import axios from 'axios';

const axiosInstance = axios.create();

axios.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default axiosInstance;
