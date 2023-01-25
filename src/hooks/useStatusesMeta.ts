import { useQuery } from '@tanstack/react-query';
import useErrorToast from './useErrorToast';
import api from '../api';

export default function useStatusesMeta() {
  const query = useQuery(
    ['statuses-meta'],
    async () => await api.statuses.getMeta(),
    {
      refetchOnWindowFocus: false,
    }
  );

  useErrorToast({
    title: 'Could not fetch statuses meta',
    error: query.error,
  });

  return query;
}
