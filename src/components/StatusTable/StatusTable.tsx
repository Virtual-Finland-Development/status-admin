import {
  useState,
  useCallback,
  useEffect,
  ReactElement,
  Fragment,
} from 'react';
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Checkbox,
  useDisclosure,
  Stack,
  Divider,
} from '@chakra-ui/react';
import {
  TriangleDownIcon,
  TriangleUpIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import { faker } from '@faker-js/faker';
import { format, parseISO } from 'date-fns';

// types
import { StatusRecord } from '../../@types';

// components
import StatusSelect from './StatusSelect';
import TablePagination from './TablePagination';
import Modal from '../Modal/Modal';

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
  columnHelper.accessor('id', {
    cell: info => info.getValue(),
    header: '',
    meta: {
      isSelect: true,
    },
  }),
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
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<StatusRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalSettings, setModalSettings] = useState<{
    title: string;
    content: ReactElement | string;
  }>({ title: '', content: '' });

  const {
    isOpen: modalIsOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  useEffect(() => {
    setSelectedIds([]);

    if (search.length) {
      setFilteredData(
        dummyData.filter(i =>
          i.email.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredData(dummyData);
    }
  }, [search]);

  const table = useReactTable({
    columns,
    data: filteredData,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  const toggleAllSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { rows } = table.getPaginationRowModel();

      if (e.target.checked) {
        setSelectedIds(rows.map(row => row.original.id));
      } else {
        setSelectedIds([]);
      }
    },
    [table]
  );

  const toggleSingleSelect = useCallback(
    (target: EventTarget & HTMLInputElement, id: string) => {
      if (target.checked) {
        setSelectedIds(ids => [...ids, id]);
      } else {
        setSelectedIds(ids => ids.filter(sId => sId !== id));
      }
    },
    []
  );

  const handleStatusChange = useCallback((id: string, newStatus: string) => {
    console.log(id);
    console.log(newStatus);
  }, []);

  const handleDelete = useCallback((id: string) => {
    console.log(id);
  }, []);

  const handleBatchUpdate = useCallback(
    (selectedStatus: string) => {
      console.log(selectedStatus);
      console.log(selectedIds);
      setSelectedIds([]);
      onModalClose();
    },
    [onModalClose, selectedIds]
  );

  const handleBatchDelete = useCallback(() => {
    console.log(selectedIds);
    setSelectedIds([]);
    onModalClose();
  }, [onModalClose, selectedIds]);

  const openBatchUpdateModal = useCallback(() => {
    setModalSettings({
      title: `Change status for selected (${selectedIds.length})`,
      content: (
        <StatusSelect
          handleSelect={handleBatchUpdate}
          handleClose={onModalClose}
        />
      ),
    });
    onModalOpen();
  }, [handleBatchUpdate, onModalClose, onModalOpen, selectedIds.length]);

  const openBatchDeleteModal = useCallback(() => {
    setModalSettings({
      title: `Remove selected (${selectedIds.length})?`,
      content: (
        <Stack spacing={6}>
          <Text>Remove selected?</Text>
          <Flex alignItems="center" justifyContent="end" gap={4}>
            <Button onClick={onModalClose}>Cancel</Button>
            <Button colorScheme="red" onClick={handleBatchDelete}>
              Remove
            </Button>
          </Flex>
        </Stack>
      ),
    });
    onModalOpen();
  }, [handleBatchDelete, onModalClose, onModalOpen, selectedIds.length]);

  return (
    <Fragment>
      <TableContainer
        bg="white"
        py={2}
        mx={4}
        border="1px"
        rounded="lg"
        borderColor="purple.100"
        boxShadow="lg"
      >
        <Flex justifyContent="space-between" py={3} mx={4} gap={3}>
          <Input
            value={search}
            onChange={({ target }) => setSearch(target.value)}
            placeholder="Search"
            w={{ base: 'auto', md: 'sm' }}
          />
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              colorScheme="purple"
              disabled={!selectedIds.length}
            >
              Selected ({selectedIds.length})
            </MenuButton>
            <MenuList>
              <MenuItem onClick={openBatchUpdateModal}>Change status</MenuItem>
              <MenuItem onClick={openBatchDeleteModal}>
                Remove selected
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <Divider />

        <Table variant="striped" colorScheme="gray">
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const meta = header.column.columnDef.meta;

                  if (meta?.isSelect) {
                    return (
                      <Th key={header.id}>
                        <Checkbox
                          colorScheme="purple"
                          isChecked={
                            selectedIds.length > 0 &&
                            selectedIds.length ===
                              table.getState().pagination.pageSize
                          }
                          onChange={toggleAllSelected}
                        />
                      </Th>
                    );
                  }

                  return (
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
                  );
                })}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {table.getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  const meta = cell.column.columnDef.meta;

                  if (meta?.isSelect) {
                    return (
                      <Td key={cell.id}>
                        <Checkbox
                          bg="white"
                          colorScheme="purple"
                          isChecked={selectedIds.some(
                            id => id === row.original.id
                          )}
                          onChange={({ target }) =>
                            toggleSingleSelect(target, row.original.id)
                          }
                        />
                      </Td>
                    );
                  }

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
                            Remove
                          </Button>
                        </Flex>
                      </Td>
                    );
                  }

                  return (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>

        <TablePagination
          table={table}
          onStateChange={() => setSelectedIds([])}
        />
      </TableContainer>

      <Modal
        isOpen={modalIsOpen}
        onClose={onModalClose}
        modalSettings={modalSettings}
      />
    </Fragment>
  );
}

export default StatusTable;
