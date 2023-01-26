import axiosInstance from '../axiosInstance';

import { STATUS_INFO_API_BASE_URL } from '../endpoints';

export async function logIn(credentials: {
  username: string;
  password: string;
}) {
  const { data } = await axiosInstance.post(
    `${STATUS_INFO_API_BASE_URL}/status-admin/auth/login`,
    credentials
  );
  return data;
}
