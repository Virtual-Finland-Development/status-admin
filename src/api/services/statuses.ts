import { StatusRecord } from '../../@types';
import axiosInstance from '../axiosInstance';

import { STATUS_INFO_API_BASE_URL } from '../endpoints';

export async function getAll(): Promise<StatusRecord[]> {
  const {
    data: { items },
  } = await axiosInstance.get(
    `${STATUS_INFO_API_BASE_URL}/status-admin/statusinfos`
  );
  return items;
}

export async function updateSingle(id: string): Promise<StatusRecord> {
  const { data } = await axiosInstance.post(
    `${STATUS_INFO_API_BASE_URL}/status-admin/statusinfos/${id}`
  );
  return data;
}

export async function deleteSingle(id: string): Promise<void> {
  await axiosInstance.delete(
    `${STATUS_INFO_API_BASE_URL}/status-admin/statusinfos/${id}`
  );
}
