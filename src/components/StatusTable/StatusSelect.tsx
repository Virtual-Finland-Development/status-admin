import { useState } from 'react';
import { Flex, Button, Select, Stack } from '@chakra-ui/react';

import { statuses } from './StatusTable';

function StatusSelect({
  handleSelect,
  handleClose,
}: {
  handleSelect: (status: string) => void;
  handleClose: () => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState('draft');

  return (
    <Stack spacing={6}>
      <Select
        bg="white"
        onChange={({ target }) => setSelectedStatus(target.value)}
      >
        {statuses.map(status => (
          <option key={status} value={status}>
            {status}
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