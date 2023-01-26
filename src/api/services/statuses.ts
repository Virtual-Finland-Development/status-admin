import { StatusType, StatusRecord } from '../../@types';
import axiosInstance from '../axiosInstance';

import { STATUS_INFO_API_BASE_URL } from '../endpoints';

export async function getMeta(): Promise<StatusType[]> {
  const { data } = await axiosInstance.get(
    `${STATUS_INFO_API_BASE_URL}/status-admin/get-known-statuses`
  );
  return data;
}

export async function getAll(): Promise<StatusRecord[]> {
  const { data } = await axiosInstance.get(
    `${STATUS_INFO_API_BASE_URL}/status-admin/status-infos`
  );
  return data;
}

export async function updateSingle(
  id: string,
  statusValue: string
): Promise<StatusRecord> {
  const { data } = await axiosInstance.post(
    `${STATUS_INFO_API_BASE_URL}/status-admin/status-infos/${id}`,
    { statusValue }
  );
  return data;
}

export async function updateMultiple(
  records: Partial<StatusRecord>[]
): Promise<void> {
  await axiosInstance.post(
    `${STATUS_INFO_API_BASE_URL}/status-admin/status-infos`,
    records
  );
}

export async function deleteSingle(id: string): Promise<void> {
  await axiosInstance.delete(
    `${STATUS_INFO_API_BASE_URL}/status-admin/status-infos/${id}`
  );
}

export async function deleteMultiple(
  records: Partial<StatusRecord>[]
): Promise<void> {
  await axiosInstance.delete(
    `${STATUS_INFO_API_BASE_URL}/status-admin/status-infos`,
    { data: records }
  );
}
