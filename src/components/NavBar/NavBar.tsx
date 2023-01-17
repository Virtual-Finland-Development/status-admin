import { useContext } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

// context
import { GlobalStateContext } from '../App/App';

function NavBar() {
  const { authService } = useContext(GlobalStateContext);
  const { send } = authService;

  const handleLogOutClick = () => {
    send({ type: 'LOG_OUT' });
  };

  return (
    <Box bg="purple.500" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Text
            fontSize={{ base: 'md', md: 'xl' }}
            fontFamily="sans-serif"
            fontWeight="bold"
            color="white"
          >
            VFD Status Admin
          </Text>
        </Box>
        <Flex alignItems="center">
          <Menu>
            <MenuButton
              color="white"
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
              _expanded={{ color: 'white' }}
              rightIcon={<ChevronDownIcon />}
            >
              <Text>Actions</Text>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogOutClick}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}

export default NavBar;
