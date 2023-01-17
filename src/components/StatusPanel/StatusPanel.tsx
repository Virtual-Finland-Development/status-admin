import React from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Container,
  List,
  ListItem,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';

interface StatusPanelProps {
  logOut: () => void;
}

const statuses = [
  'draft',
  'sent',
  'processing',
  'awaiting additional info',
  'done',
];

let dummyData: { id: number; email: string; status: string }[] = [];

for (let i = 0; i < 50; i++) {
  const status = Math.floor(Math.random() * statuses.length);
  dummyData.push({
    id: i + 1,
    email: faker.internet.email(),
    status: statuses[status],
  });
}

function StatusPanel(props: StatusPanelProps) {
  return (
    <React.Fragment>
      <List spacing={4}>
        {dummyData.map(item => (
          <Card key={item.id}>
            <CardBody>
              <Text>{item.email}</Text>
            </CardBody>
          </Card>
        ))}
      </List>
    </React.Fragment>
  );
}

export default StatusPanel;
