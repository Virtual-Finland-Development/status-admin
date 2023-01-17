import { useState, useCallback } from 'react';
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  Flex,
  Button,
  Select,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  chakra,
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { faker } from '@faker-js/faker';
import { format, parseISO } from 'date-fns';

// types
import { StatusRecord } from '../@types';

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

const columnHelper = createColumnHelper<StatusRecord>();

const columns = [
  columnHelper.accessor('email', {
    cell: info => <Text fontWeight="semibold">{info.getValue()}</Text>,
    header: 'User email',
  }),
  columnHelper.accessor('modified', {
    cell: info => format(parseISO(info.getValue()), 'yyyy-MM-dd'),
    header: 'Last modified',
  }),
  columnHelper.accessor('status', {
    cell: info => info.getValue(),
    header: 'Status',
    meta: {
      isStatusEdit: true,
    },
  }),
];

function StatusTable() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data: dummyData,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const handleStatusChange = useCallback((id: string, newStatus: string) => {
    console.log(id);
    console.log(newStatus);
  }, []);

  const handleDelete = useCallback((id: string) => {
    console.log(id);
  }, []);

  return (
    <TableContainer
      bg="white"
      py={2}
      px={4}
      border="1px"
      rounded="lg"
      borderColor="gray.100"
      boxShadow="lg"
    >
      <Table variant="striped" colorScheme="gray">
        <Thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  cursor="pointer"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  <chakra.span pl="4">
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === 'desc' ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map(row => (
            <Tr key={row.id}>
              {row.getVisibleCells().map(cell => {
                const meta = cell.column.columnDef.meta;

                if (meta?.isStatusEdit) {
                  return (
                    <Td key={cell.id}>
                      <Flex gap={6}>
                        <Select
                          bg="white"
                          defaultValue={cell.getValue() as string}
                          onChange={({ target }) =>
                            handleStatusChange(row.original.id, target.value)
                          }
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                        <Button
                          colorScheme="red"
                          variant="outline"
                          bg="white"
                          onClick={() => handleDelete(row.original.id)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </Td>
                  );
                }

                return (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default StatusTable;
