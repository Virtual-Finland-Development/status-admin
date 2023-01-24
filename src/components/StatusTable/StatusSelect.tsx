import { useState } from 'react';
import { Flex, Button, Select, Stack } from '@chakra-ui/react';

// hooks
import useStatusesMeta from '../../hooks/useStatusesMeta';

// components
import Loading from '../Loading/Loading';

function StatusSelect({
  handleSelect,
  handleClose,
}: {
  handleSelect: (status: string) => void;
  handleClose: () => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState('draft');
  const { data: statusesMeta, isLoading: metaLoading } = useStatusesMeta();

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
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          colorScheme="purple"
          onClick={() => handleSelect(selectedStatus)}
        >
          Save
        </Button>
      </Flex>
    </Stack>
  );
}

export default StatusSelect;
