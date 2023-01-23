import { StatusRecord } from '../../@types';
import axiosInstance from '../axiosInstance';

import { STATUS_INFO_API_BASE_URL } from '../endpoints';

export async function getAll(): Promise<StatusRecord[]> {
  const {
    data: { items },
  } = await axiosInstance.get(`${STATUS_INFO_API_BASE_URL}/status-admin/all`);
  return items;
}
