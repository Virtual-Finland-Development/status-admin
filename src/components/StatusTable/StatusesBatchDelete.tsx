import { useCallback } from 'react';
import { Flex, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

// types
import { StatusRecord } from '../../@types';

// api
import api from '../../api';

interface StatusesBatchDeleteProps {
  selectedIds: string[];
  handleClose: () => void;
  onSuccess: (ids: string[]) => void;
}

function StatusesBatchDelete(props: StatusesBatchDeleteProps) {
  const { selectedIds, handleClose, onSuccess } = props;

  const toast = useToast();

  const { mutate, isLoading } = useMutation({
    mutationFn: (records: Partial<StatusRecord>[]) =>
      api.statuses.deleteMultiple(records),
    onSuccess: (_, records) => {
      toast({
        title: 'Updated',
        description: 'Status records removed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSuccess(records.map(r => r.id || ''));
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Status records could not be removed.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleBatchDelete = useCallback(
    () => mutate(selectedIds.map(id => ({ id }))),
    [mutate, selectedIds]
  );

  return (
    <Stack spacing={6}>
      <Text>Remove selected?</Text>
      <Flex alignItems="center" justifyContent="end" gap={4}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          colorScheme="red"
          onClick={handleBatchDelete}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Remove
        </Button>
      </Flex>
    </Stack>
  );
}

export default StatusesBatchDelete;
