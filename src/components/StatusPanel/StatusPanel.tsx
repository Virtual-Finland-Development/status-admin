import React from 'react';
import { List } from '@chakra-ui/react';
import { format } from 'date-fns';

import dummyUsers from '../StatusTable/dummyUsers.json';

// types
import { StatusRecord } from '../../@types';

// components
import StatusItem from './StatusItem';

export const statusValues = ['COMPLETED', 'IN_PROGRESS', 'FAILED', 'CANCELLED'];

export const statuses: Record<string, string> = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In progress',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

let dummyData: StatusRecord[] = [];

for (let i = 0; i < 50; i++) {
  const status = Math.floor(Math.random() * statusValues.length);
  dummyData.push({
    id: (i + 1).toString(),
    statusName: 'dummyStatus',
    statusValue: statusValues[status],
    updatedAt: format(new Date(), 'yyyy-MM-dd'),
    userId: dummyUsers[i].id,
    userEmail: dummyUsers[i].email,
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
