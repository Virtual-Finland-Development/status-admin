import React from 'react';
import { List } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';

// types
import { StatusRecord } from '../../@types';

// components
import StatusItem from './StatusItem';

export const statuses = [
  'draft',
  'sent',
  'processing',
  'awaiting additional info',
  'done',
];

let dummyData: StatusRecord[] = [];

for (let i = 0; i < 50; i++) {
  const status = Math.floor(Math.random() * statuses.length);
  dummyData.push({
    id: (i + 1).toString(),
    email: faker.internet.email(),
    status: statuses[status],
    modified: format(new Date(), 'yyyy-MM-dd'),
  });
}

function StatusPanel() {
  return (
    <React.Fragment>
      <List spacing={4}>
        {dummyData.map(item => (
          <StatusItem key={item.id} item={item} />
        ))}
      </List>
    </React.Fragment>
  );
}

export default StatusPanel;
