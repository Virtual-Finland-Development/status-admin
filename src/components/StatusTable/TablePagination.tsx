import { Table } from '@tanstack/react-table';
import { Flex, Select, Text, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

// types
import { StatusRecord } from '../../@types';

function TablePagination(props: Table<StatusRecord>) {
  const {
    previousPage,
    getCanPreviousPage,
    getState,
    getPageCount,
    setPageSize,
    nextPage,
    getCanNextPage,
  } = props;

  return (
    <Flex justifyContent="center">
      <Flex justifyContent="space-between" m={4} alignItems="center" w="lg">
        <Flex mr={3}>
          <IconButton
            aria-label="Previous page"
            onClick={() => previousPage()}
            disabled={!getCanPreviousPage()}
            icon={<ChevronLeftIcon h={6} w={6} />}
            colorScheme="purple"
          />
        </Flex>

        <Flex alignItems="center">
          <Text flexShrink="0" mr={8}>
            Page{' '}
            <Text fontWeight="bold" as="span">
              {getState().pagination.pageIndex + 1}
            </Text>{' '}
            of{' '}
            <Text fontWeight="bold" as="span">
              {getPageCount()}
            </Text>
          </Text>
          <Select
            w={32}
            value={getState().pagination.pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[25, 50, 75].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex ml={3}>
          <IconButton
            aria-label="Next page"
            onClick={() => nextPage()}
            disabled={!getCanNextPage()}
            icon={<ChevronRightIcon h={6} w={6} />}
            colorScheme="purple"
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default TablePagination;
