import React from 'react';
import { Text, List, Card, CardBody } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';

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

function StatusPanel() {
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
