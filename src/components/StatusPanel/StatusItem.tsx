import {
  Text,
  Card,
  CardBody,
  SimpleGrid,
  Select,
  Flex,
  Button,
} from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';

// types
import { StatusRecord } from '../@types';

import { statuses } from './StatusPanel';

function StatusItem({ item }: { item: StatusRecord }) {
  return (
    <Card key={item.id}>
      <CardBody>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={4}
          alignItems="center"
        >
          <Flex justifyContent="space-between">
            <Text fontWeight="semibold">{item.email}</Text>
            <Text>{format(parseISO(item.modified), 'yyyy-MM-dd')}</Text>
          </Flex>
          <Flex
            flexDirection="row"
            justifyContent={{ base: 'space-between', md: 'end' }}
            gap={6}
          >
            <Select defaultValue={item.status} w="auto">
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <Button colorScheme="red" variant="outline">
              Delete
            </Button>
          </Flex>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
}

export default StatusItem;
