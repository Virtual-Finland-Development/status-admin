import { useState, useCallback } from 'react';
import { Flex, Button, Select, Stack, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

// types
import { StatusRecord } from '../../@types';

// hooks
import useStatusesMeta from '../../hooks/useStatusesMeta';

// components
import Loading from '../Loading/Loading';

// api
import api from '../../api';

interface StatusBatchSelectProps {
  selectedIds: string[];
  handleClose: () => void;
}

function StatusBatchSelect(props: StatusBatchSelectProps) {
  const { selectedIds, handleClose } = props;
  const [selectedStatus, setSelectedStatus] = useState('SENT');
  const { data: statusesMeta, isLoading: metaLoading } = useStatusesMeta();

  const toast = useToast();

  const { mutate, isLoading } = useMutation({
    mutationFn: (records: Partial<StatusRecord>[]) =>
      api.statuses.updateMultiple(records),
    onSuccess: () => {
      toast({
        title: 'Updated',
        description: 'Status records updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Status records could not be updated.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleBatchUpdate = useCallback(
    () => mutate(selectedIds.map(id => ({ id, statusValue: selectedStatus }))),
    [mutate, selectedIds, selectedStatus]
  );

  if (metaLoading) {
    return <Loading />;
  }

  return (
    <Stack spacing={6}>
      <Select
        bg="white"
        onChange={({ target }) => setSelectedStatus(target.value)}
      >
        {statusesMeta &&
          statusesMeta.map(item => (
            <option key={item.statusValue} value={item.statusValue}>
              {item.label}
            </option>
          ))}
      </Select>
      <Flex alignItems="center" justifyContent="end" gap={4}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          colorScheme="purple"
          onClick={handleBatchUpdate}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Save
        </Button>
      </Flex>
    </Stack>
  );
}

export default StatusBatchSelect;
