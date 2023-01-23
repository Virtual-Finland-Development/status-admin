import { useQuery } from '@tanstack/react-query';
import useErrorToast from './useErrorToast';
import api from '../api';

export default function useStatuses() {
  const query = useQuery(
    ['statuses'],
    async () => await api.statuses.getAll(),
    {
      refetchOnWindowFocus: false,
    }
  );

  useErrorToast({
    title: 'Could not fetch statuses',
    error: query.error,
  });

  return query;
}
