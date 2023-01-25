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
  IconButton,
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
  useToast,
} from '@chakra-ui/react';
import {
  TriangleDownIcon,
  TriangleUpIcon,
  ChevronDownIcon,
  RepeatIcon,
} from '@chakra-ui/icons';
import { format, parseISO } from 'date-fns';

// types
import { StatusRecord } from '../../@types';

// hooks
import useStatusesMeta from '../../hooks/useStatusesMeta';
import useStatuses from '../../hooks/useStatuses';

// components
import StatusSelect from './StatusSelect';
import TablePagination from './TablePagination';
import Loading from '../Loading/Loading';
import Modal from '../Modal/Modal';
import api from '../../api';

const columnHelper = createColumnHelper<StatusRecord>();

const columns = [
  columnHelper.accessor('id', {
    cell: info => info.getValue(),
    header: '',
    meta: {
      isSelect: true,
    },
  }),
  columnHelper.accessor('userEmail', {
    cell: info => (
      <Flex flexDirection="column">
        <Text fontWeight="semibold">{info.getValue()}</Text>
        <Text fontSize="sm" fontWeight="light">
          id: {info.row.original.userId}
        </Text>
      </Flex>
    ),
    header: 'User',
  }),
  columnHelper.accessor('updatedAt', {
    cell: info => format(parseISO(info.getValue()), 'dd.MM.yyyy HH:mm'),
    header: 'Last modified',
  }),
  columnHelper.accessor('statusValue', {
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

  const { data: statusesMeta, isLoading: metaLoading } = useStatusesMeta();
  const {
    data: statusRecords,
    isLoading: recordsLoading,
    isFetching: recordsFetching,
    refetch,
  } = useStatuses();

  const {
    isOpen: modalIsOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const toast = useToast();

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

  /**
   * Set filtered data to state, depending on search
   */
  useEffect(() => {
    if (!recordsLoading) {
      setSelectedIds([]);

      if (search.length) {
        setFilteredData(
          statusRecords!.filter(i =>
            i.userEmail.toLowerCase().includes(search.toLowerCase())
          )
        );
      } else {
        setFilteredData(statusRecords!);
      }
    }
  }, [recordsLoading, search, statusRecords]);

  /**
   * Toggle all records selected / de-selected
   */
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

  /**
   * Toggle single record selection
   */
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

  /**
   * Update status for single record
   */
  const handleStatusChange = useCallback(
    async (id: string, newStatus: string) => {
      try {
        const updatedRecord = await api.statuses.updateSingle(id, newStatus);
        setFilteredData(data =>
          data.map(r => (r.id === id ? updatedRecord : r))
        );
        toast({
          title: 'Updated',
          description: 'Status record updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Could not update status record.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  /**
   * Delete single status record
   */
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await api.statuses.deleteSingle(id);
        setFilteredData(data => data.filter(r => r.id !== id));
        toast({
          title: 'Removed',
          description: 'Status record removed.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Could not remove status record.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

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

  if (metaLoading || recordsLoading) {
    return <Loading />;
  }

  if (!statusRecords?.length) {
    return (
      <Flex
        bg="white"
        p={6}
        border="1px"
        rounded="lg"
        borderColor="purple.100"
        boxShadow="lg"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontWeight="semibold">No status records found.</Text>
        <Button
          colorScheme="purple"
          rightIcon={<RepeatIcon />}
          isLoading={recordsFetching}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </Flex>
    );
  }

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
        <Flex
          justifyContent="space-between"
          flexWrap="wrap"
          py={3}
          mx={4}
          gap={3}
        >
          <Input
            value={search}
            onChange={({ target }) => setSearch(target.value)}
            placeholder="Search"
            w={{ base: 'full', md: 'sm' }}
          />
          <Flex
            gap={3}
            justifyContent={{ base: 'space-between' }}
            w={{ base: 'full', md: 'auto' }}
          >
            <IconButton
              colorScheme="purple"
              variant="outline"
              aria-label="refresh"
              icon={<RepeatIcon />}
              isLoading={recordsFetching}
              onClick={() => refetch()}
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
                <MenuItem onClick={openBatchUpdateModal}>
                  Change status
                </MenuItem>
                <MenuItem onClick={openBatchDeleteModal}>
                  Remove selected
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
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
                            {statusesMeta &&
                              statusesMeta.map(item => (
                                <option
                                  key={item.statusValue}
                                  value={item.statusValue}
                                >
                                  {item.label}
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
